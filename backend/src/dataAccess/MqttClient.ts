import {injectable, inject} from 'inversify'
import {AsyncMqttClient} from 'async-mqtt'
import {mqttHost, mqttPort, mqttProtocol, checkMqttItemsIntervalTimeout} from '@config'
import {logger} from '@shared'
import {IMqttClient, IMqttImpl, TYPES} from './types'
import * as JsonRpc from './JsonRpc'
import * as RosUtils from './RosUtils'

const MAX_REQUESTS_SIZE = 1000
const CHUNKS_TO_REMOVE = 100
const MAX_CHECKS_PER_ITEM = 10

interface RequestObject {
    resolve: (data?: object | PromiseLike<object>) => void
    reject: (reason?: object | PromiseLike<object> | string) => void
    timesChecked: number
}

@injectable()
export class MqttClient implements IMqttClient {
    private client: AsyncMqttClient
    private healthStatusHandlers: CallableFunction[]
    private logHandlers: CallableFunction[]
    private requests: {
        [id: string]: RequestObject;
    }
    private requestsOrdered: string[]
    private currentRequestId: number
    private intervalId: NodeJS.Timeout

    constructor(
        @inject(TYPES.MQTTImpl) private mqttImpl: IMqttImpl
    ) {
        this.healthStatusHandlers = []
        this.logHandlers = []
        this.requests = {}
        this.requestsOrdered = []
        this.currentRequestId = new Date().getTime()

        this.checkItems = this.checkItems.bind(this)
        this.handleMessage = this.handleMessage.bind(this)

        this.intervalId = setInterval(this.checkItems, checkMqttItemsIntervalTimeout)

        this.client = mqttImpl.connect(undefined, {
            host: mqttHost,
            port: mqttPort ? Number(mqttPort) : undefined,
            protocol: mqttProtocol as ('mqtt' | 'mqtts'),
        })
        this.client.on('connect', async () => {
            this.client.subscribe('jsonrpc_service_res')
            this.client.subscribe('healthStatus')
            this.client.subscribe('bci/info_scheduler')
            this.client.on('message', this.handleMessage)
        })
    }

    async destroy() {
        clearInterval(this.intervalId)
        await this.client.end(true, {callback: this.handleMessage} as never)
    }

    getRequestsOrdered(): string[] {
        return this.requestsOrdered
    }

    registerHealthStatusHandler(messageHandler: CallableFunction): void {
        this.healthStatusHandlers.push(messageHandler)
    }

    unregisterHealthStatusHandler(messageHandler: CallableFunction): void {
        this.healthStatusHandlers = this.healthStatusHandlers.filter(handler => handler !== messageHandler)
    }

    registerLogHandler(messageHandler: CallableFunction): void {
        this.logHandlers.push(messageHandler)
    }

    unregisterLogHandler(messageHandler: CallableFunction): void {
        this.logHandlers = this.logHandlers.filter(handler => handler !== messageHandler)
    }

    // Note: params can be really anything
    // tslint:disable-next-line
    async makeRequest(method: string, params: any[] = []): Promise<any> {
        const requestId = (this.currentRequestId++).toString()
        const req = new JsonRpc.Request({jsonrpc: '2.0', id: requestId, method, params})
        const resultPromise = new Promise<object>((resolve, reject) => {
            this.updateRequestsWhenSending(
                requestId,
                resolve,
                reject
            )
        })

        try {
            const reqStr = JSON.stringify(req)
            const stdMsgsStr = RosUtils.toStdMsgsString(reqStr)
            await this.client.publish('jsonrpc_service_req', stdMsgsStr)
        } catch (error) {
            logger.error(error.message, error)
            if (this.requests[requestId]) {
                this.requests[requestId].reject(error)
                this.deleteRequestById(requestId)
                this.requestsOrdered = this.requestsOrdered.filter(id => id !== requestId)
            }
        }

        return resultPromise
    }

    private handleMessage(topic: string, messageBuffer: Buffer): void {
        switch (topic) {
            case 'jsonrpc_service_res':
                return this.handleJsonRpcResponse(messageBuffer)
            case 'healthStatus':
               return this.healthStatusHandlers.forEach(handler => handler(messageBuffer))
            case 'bci/info_scheduler':
                return this.logHandlers.forEach(handler => handler(messageBuffer))
            default:
                logger.warn('unknown topic:', topic)
        }
    }

    private handleJsonRpcResponse(messageBuffer: Buffer): void {
        try {
            const resStr = RosUtils.fromStdMsgsString(messageBuffer.toString())
            const res = JsonRpc.createFromString(JsonRpc.Response, resStr)

            if (!res.id) {
                if (res.isError()) {
                    logger.warn(`JSON-RPC error response (${res.error!.code}): ${res.error!.message}`)
                    return
                }
                logger.error('Strange JSON-RPC response:', JSON.stringify(res))
                return
            }

            const request = this.requests[res.id]
            if (!request) {
                logger.warn('Unknown JSON-RPC request/response id:', res.id)
                return
            }

            if (res.isError()) {
                request.reject(res.error)
            } else {
                request.resolve(res.result)
            }

            this.requestsOrdered = this.requestsOrdered.filter(id => id !== String(res.id))
            delete this.requests[res.id]
        } catch (error) {
            logger.error(error.message, error)
        }
    }

    private checkItems(): void {
        const itemsToRemove = new Set<string>()
        this.requestsOrdered.forEach(requestId => {
            const request = this.requests[requestId]
            if (!request || request.timesChecked >= MAX_CHECKS_PER_ITEM) {
                itemsToRemove.add(requestId)
            } else {
                request.timesChecked++
            }
        })

        this.requestsOrdered = this.requestsOrdered.filter(requestId => !itemsToRemove.has(requestId))
        itemsToRemove.forEach(id => this.deleteRequestById(id))
    }

    private updateRequestsWhenSending(
        requestId: string,
        resolve: (data?: object | PromiseLike<object>) => void,
        reject: (reason?: object | PromiseLike<object> | string) => void
    ) {
        this.requestsOrdered.push(requestId)
        this.requests[requestId] = {
            resolve,
            reject,
            timesChecked: 0,
        }

        if (this.requestsOrdered.length > MAX_REQUESTS_SIZE) {
            const itemsToRemove = this.requestsOrdered.slice(0, CHUNKS_TO_REMOVE)
            itemsToRemove.forEach(id => this.deleteRequestById(id))

            this.requestsOrdered = this.requestsOrdered.slice(CHUNKS_TO_REMOVE)
        }
    }

    private deleteRequestById(requestId: string): void {
        const request = this.requests[requestId]
        if (request) {
            request.reject('timeout')
        }

        delete this.requests[requestId]
    }
}

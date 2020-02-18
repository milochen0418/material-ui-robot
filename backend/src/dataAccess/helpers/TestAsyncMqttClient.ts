/* tslint:disable:ban-types no-any ban-ts-ignore */
import MQTT, {
    IMqttClient,
    IClientPublishOptions,
    IClientReconnectOptions,
    IClientSubscribeOptions,
    ISubscriptionMap,
    OnErrorCallback,
    OnMessageCallback,
    OnPacketCallback,
} from 'async-mqtt'
import {
    ClientSubscribeCallback,
    CloseCallback,
    PacketCallback,
    Store,
} from 'mqtt'

export class TestAsyncMqttClient implements IMqttClient {
    connected: boolean
    disconnecting: boolean
    disconnected: boolean
    reconnecting: boolean
    incomingStore: Store
    outgoingStore: Store
    options: MQTT.IClientOptions
    queueQoSZero: boolean
    private eventListeners: Function[]

    constructor() {
        this.connected = true
        this.disconnected = false
        this.disconnecting = false
        this.reconnecting = false
        this.incomingStore = new Store({})
        this.outgoingStore = new Store({})
        this.options = {}
        this.queueQoSZero = false
        this.eventListeners = []

        this.on = this.on.bind(this)
        this.publish = this.publish.bind(this)
        this.subscribe = this.subscribe.bind(this)
        this.end = this.end.bind(this)
    }

    on(
        event: 'message' | 'packetsend' | 'packetreceive' | 'error' | string,
        // tslint:disable-next-line:ban-types
        cb: OnMessageCallback | OnPacketCallback | OnErrorCallback | Function
    ): this {
        if (event === 'connect') {
            (cb as Function)()
        } else {
            this.eventListeners.push(cb)
        }

        return this
    }

    once(
        event: 'message' | 'packetsend' | 'packetreceive' | 'error' | string,
        cb: OnMessageCallback | OnPacketCallback | OnErrorCallback | Function
    ): this {
        return this
    }

    publish(
        topic: string,
        message: string | Buffer,
        opts?: any
    ): this {
        const packet = JSON.stringify({topic, ...JSON.parse(message as string)})

        this.eventListeners.forEach(callback => this.handleMessage(packet, callback))

        if (typeof opts === 'function') {
            opts()
        }

        return this
    }

    subscribe(
        topic: string | string[] | ISubscriptionMap,
        opts: IClientSubscribeOptions | (ClientSubscribeCallback | undefined),
        callback?: ClientSubscribeCallback
    ): this {
        if (typeof opts === 'function') {
            // @ts-ignore
            opts(undefined, undefined)
        } else if (callback) {
            // @ts-ignore
            callback(undefined, undefined)
        }

        return this
    }

    unsubscribe(topic: string | string[], opts?: object, callback?: PacketCallback) {
        return this
    }

    end(force?: boolean, opts?: {[field: string]: any}, cb?: CloseCallback): this {
        // tslint:disable-next-line:prefer-const
        let [first, ...remaining] = this.eventListeners
        if (typeof opts === 'object' && opts.callback) {
            remaining = this.eventListeners.filter(callback => callback !== opts.callback)
        }

        this.eventListeners = remaining
        if (cb) {
            cb()
        } else if (typeof opts === 'function') {
            opts()
        } else if (typeof force === 'function') {
            (force as Function)()
        }

        return this
    }

    removeOutgoingMessage(mid: number): this {
        return this
    }

    reconnect(opts?: IClientReconnectOptions): this {
        return this
    }

    handleMessage(packet: any, callback: any): void {
        const {topic} = JSON.parse(packet)
        callback(topic, packet)
    }

    getLastMessageId(): number {
        return -1
    }

    addListener(event: string | symbol, listener: (...args: any[]) => void): this {
        return this
    }

    prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
        return this
    }

    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
        return this
    }

    removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
        return this
    }

    off(event: string | symbol, listener: (...args: any[]) => void): this {
        return this
    }

    removeAllListeners(event?: string | symbol | undefined): this {
        return this
    }

    setMaxListeners(n: number): this {
        return this
    }

    getMaxListeners(): number {
        return 100
    }

    listeners(event: string | symbol): Function[] {
        return []
    }

    rawListeners(event: string | symbol): Function[] {
        return []
    }

    emit(event: string | symbol, ...args: any[]): boolean {
        return true
    }

    eventNames(): Array<string | symbol> {
        return []
    }

    listenerCount(type: string | symbol): number {
        return 0
    }
}

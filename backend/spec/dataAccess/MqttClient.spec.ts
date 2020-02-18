import 'reflect-metadata'
import {AsyncMqttClient} from 'async-mqtt'
import {IMqttImpl, MqttClient, TYPES} from '@dataAccess'
import {mqttHost} from '@config'
import Container from '@container'
import {wait} from '../testUtils'
import * as RosUtils from '../../src/dataAccess/RosUtils'

describe('MqttClient', () => {
    const mqttImpl = Container.get<IMqttImpl>(TYPES.MQTTImpl)
    let mqttClient: MqttClient
    let mqtt: AsyncMqttClient

    beforeAll((done) => {
        mqtt = mqttImpl.connect(mqttHost)
        mqtt.on('connect', () => {
            done()
        })
    })

    beforeEach(() => {
        mqttClient = new MqttClient(mqttImpl)
    })

    afterEach(async () => {
        await mqttClient.destroy()
    })

    it(`should return proper result if response to request times out`, async () => {
        let err: string | undefined
        try {
            await mqttClient.makeRequest('test')
        } catch (error) {
            err = error
        }

        expect(err).toBe('timeout')
    })

    it(`should send request`, async () => {
        const requestQueueBefore = mqttClient.getRequestsOrdered()
        expect(requestQueueBefore.length).toBe(0)

        const onMessage = jasmine.createSpy()
        await mqtt.subscribe('jsonrpc_service_req')
        mqtt.on('message', onMessage)

        mqttClient.makeRequest('test')

        await wait(100)

        const requestQueueAfter = mqttClient.getRequestsOrdered()
        expect(requestQueueAfter.length).toBe(1)

        expect(onMessage).toHaveBeenCalled()

        const message = onMessage.calls.first().args[1].toString()
        const requestId = requestQueueAfter[0]
        expect(message).toContain(requestId)
    })

    it(`should return proper result on response to call`, async () => {
        const sendMessagePromise = mqttClient.makeRequest('add', [1, 2])

        await wait(100)

        const requestQueueAfter = mqttClient.getRequestsOrdered()
        expect(requestQueueAfter.length).toBe(1)

        const requestId = requestQueueAfter[0]
        const responseStr = JSON.stringify({jsonrpc: '2.0', id: requestId, result: 3})
        await mqtt.publish('jsonrpc_service_res', RosUtils.toStdMsgsString(responseStr))

        try {
            await sendMessagePromise
        } catch (error) {
            fail(error)
        }
    })
})

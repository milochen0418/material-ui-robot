import {injectable} from 'inversify'
import MQTT, {AsyncClient} from 'async-mqtt'
import {TestAsyncMqttClient} from './TestAsyncMqttClient'
import {IMqttImpl} from '../types'

let testClient: TestAsyncMqttClient | undefined

@injectable()
export class TestMqttWrapper implements IMqttImpl {
    private testClient?: TestAsyncMqttClient

    constructor() {
        testClient = new TestAsyncMqttClient()
    }

    connect(brokerUrl?: string | object, opts?: MQTT.IClientOptions) {
        return new AsyncClient(testClient as TestAsyncMqttClient)
    }
}

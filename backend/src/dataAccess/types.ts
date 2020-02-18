import {injectable} from 'inversify'
import MQTT, {AsyncMqttClient} from 'async-mqtt'
import {Robot, SimpleStatus, Status} from '@entities'

export const TYPES = {
    MQTTImpl: Symbol.for('MQTTImpl'),
    MqttClient: Symbol.for('MqttClient'),
    RobotAccess: Symbol.for('RobotAccess'),
    RobotRepository: Symbol.for('RobotRepository'),
}

export interface IMqttImpl {
    connect: (brokerUrl?: string | object, opts?: MQTT.IClientOptions) => AsyncMqttClient
}

@injectable()
export class MqttWrapper implements IMqttImpl {
    connect(brokerUrl?: string | object, opts?: MQTT.IClientOptions) {
        return MQTT.connect(brokerUrl, opts)
    }
}

export interface IRobotRepository {
    getAll: (siteId: string) => Promise<Robot[]>
    getById: (siteId: string, robotId: string) => Promise<Robot | undefined>
    add: (siteId: string, robot: Robot) => Promise<void>
    update: (siteId: string, robot: Robot) => Promise<void>
    clear: (siteId: string) => Promise<void>
}

// tslint:disable-next-line:no-empty-interface
export interface IRobotAccess {
    cancelLimitFinding: (robot: Robot) => Promise<void>
    onRobotJoined: (
        siteId: string,
        robotData: HealthStatusNotification
    ) => void
    moveJoint: (robot: Robot, joint: string, isPositiveDirection: boolean) => Promise<void>
    runLimitFinding: (robot: Robot) => Promise<void>
    setManualControl: (robot: Robot, enabled: boolean) => Promise<void>
    getJoints: (robot: Robot) => Promise<string[]>
}

export interface IMqttClient {
    // Note: params can be really anything
    // tslint:disable-next-line
    makeRequest: (method: string, params: any[]) => Promise<any>
    registerHealthStatusHandler: (messageHandler: CallableFunction) => void
    unregisterHealthStatusHandler: (messageHandler: CallableFunction) => void
    registerLogHandler: (messageHandler: CallableFunction) => void
    unregisterLogHandler: (messageHandler: CallableFunction) => void
}

export interface HealthStatusNotification {
    siteId?: string
    robot_name: string
    power_on_self_test: Status
    limit_finding: Status
    manual_control: SimpleStatus
    emergency_stop: boolean
}

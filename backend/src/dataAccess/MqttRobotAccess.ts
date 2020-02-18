import {injectable, inject} from 'inversify'
import {defaultSiteId} from '@config'
import {eventEmitter, EVENT_TYPES} from '@shared'
import {Robot} from '@entities'
import {IMqttClient, IRobotAccess, TYPES, HealthStatusNotification} from './types'
import {getDataFromMessage} from './mqttUtils'

@injectable()
export class MqttRobotAccess implements IRobotAccess {
    constructor(
        @inject(TYPES.MqttClient) private mqttClient: IMqttClient
    ) {
        this.healthStatusHandler = this.healthStatusHandler.bind(this)
        mqttClient.registerHealthStatusHandler(this.healthStatusHandler)
    }

    async runLimitFinding(robot: Robot): Promise<void> {
        await this.mqttClient.makeRequest('/aeolus_harm/remote_controller/operation', ['limit_finding start'])
    }

    async cancelLimitFinding(robot: Robot): Promise<void> {
        await this.mqttClient.makeRequest('/aeolus_harm/remote_controller/operation', ['limit_finding stop'])
    }

    async moveJoint(robot: Robot, joint: string, isPositiveDirection: boolean) {
        const command = `pulse ${joint} ${isPositiveDirection ? 'positive' : 'negative'}`
        await this.mqttClient.makeRequest('/aeolus_harm/remote_controller/operation', [command])
    }

    async setManualControl(robot: Robot, enabled: boolean) {
        const command = enabled ? 'activate' : 'deactivate'
        await this.mqttClient.makeRequest('/aeolus_harm/remote_controller/operation', [command])
    }

    async getJoints(robot: Robot): Promise<string[]> {
        const result = await this.mqttClient.makeRequest('/aeolus_harm/remote_controller/joint_list', [])
        return result.joints.split(' ')
    }

    onRobotJoined(
        siteId: string,
        robotData: HealthStatusNotification
    ) {
        const robot = {
            healthStatus: {
                limitFindingStatus: robotData.limit_finding,
                manualControl: robotData.manual_control,
                powerOnSelfTestStatus: robotData.power_on_self_test,
                emergencyStop: robotData.emergency_stop,
            },
            id: robotData.robot_name,
            lastKeepAliveReceivedAt: new Date(),
            model: 'default',
            name: robotData.robot_name,
        }

        eventEmitter.emit(EVENT_TYPES.ROBOT.UPDATED, {
            robot,
            siteId,
        })
    }

    private healthStatusHandler(message: Buffer): void {
        const data = getDataFromMessage(message) as HealthStatusNotification
        return this.onRobotJoined((data.siteId || defaultSiteId) as string, data)
    }
}

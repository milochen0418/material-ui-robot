import 'reflect-metadata'
import {IMqttImpl, IRobotAccess, IRobotRepository, MqttClient, MqttRobotAccess, TYPES} from '@dataAccess'
import {EVENT_TYPES, eventEmitter} from '@shared'
import Container from '@container'
import {Robot, SimpleStatus, Status} from '@entities'
import {wait} from '../testUtils'

describe('MqttRobotAccess', () => {
    Container.bind<IRobotAccess>('MqttRobotAccessTest').to(MqttRobotAccess)

    const siteId = 'mqttRobotAccessTestSiteId'
    const robotRepository = Container.get<IRobotRepository>(TYPES.RobotRepository)
    const robotAccess = Container.get<IRobotAccess>('MqttRobotAccessTest')

    const robotData: Robot = {
        id: 'mockRobotId1',
        name: 'robotName',
        model: 'default',
        healthStatus: {
            limitFindingStatus: Status.OK,
            manualControl: SimpleStatus.YES,
            powerOnSelfTestStatus: Status.OK,
            emergencyStop: false,
        },
        joints: ['left_arm', 'right_arm'],
        lastKeepAliveReceivedAt: new Date(),
    }

    afterAll(async () => {
        await robotRepository.clear(siteId)
    })

    it(`should call on robot joined when health status message arrives`, async () => {
        const eventSpy = jasmine.createSpy()
        eventEmitter.on(EVENT_TYPES.ROBOT.UPDATED, eventSpy)

        const mqtt = Container.get<IMqttImpl>(TYPES.MQTTImpl).connect()
        await wait(100)
        await mqtt.publish('healthStatus', JSON.stringify({
            data: {
                ...robotData,
                siteId,
            },
        }))
        await wait(100)

        expect(eventSpy).toHaveBeenCalled()
    })

    it(`should call makeRequest with proper params when runLimitFinding is called`, async () => {
        spyOn(MqttClient.prototype, 'makeRequest').and.returnValue(Promise.resolve({}))

        robotAccess.runLimitFinding(robotData)
        await wait(50)

        expect(MqttClient.prototype.makeRequest).toHaveBeenCalled()
        expect(MqttClient.prototype.makeRequest).toHaveBeenCalledWith('/aeolus_harm/remote_controller/operation', ['limit_finding start'])
    })

    it(`should call makeRequest with proper params when cancelLimitFinding is called`, async () => {
        spyOn(MqttClient.prototype, 'makeRequest').and.returnValue(Promise.resolve({}))

        robotAccess.cancelLimitFinding(robotData)
        await wait(50)

        expect(MqttClient.prototype.makeRequest).toHaveBeenCalled()
        expect(MqttClient.prototype.makeRequest).toHaveBeenCalledWith('/aeolus_harm/remote_controller/operation', ['limit_finding stop'])
    })

    it(`should call makeRequest with proper params when moveJoint is called`, async () => {
        spyOn(MqttClient.prototype, 'makeRequest').and.returnValue(Promise.resolve({}))

        robotAccess.moveJoint(robotData, 'right_arm', true)
        await wait(50)

        expect(MqttClient.prototype.makeRequest).toHaveBeenCalledTimes(1)
        expect(MqttClient.prototype.makeRequest).toHaveBeenCalledWith('/aeolus_harm/remote_controller/operation', ['pulse right_arm positive'])

        robotAccess.moveJoint(robotData, 'left_arm', false)
        await wait(50)

        expect(MqttClient.prototype.makeRequest).toHaveBeenCalledTimes(2)
        expect(MqttClient.prototype.makeRequest).toHaveBeenCalledWith('/aeolus_harm/remote_controller/operation', ['pulse left_arm negative'])
    })

    it(`should call makeRequest with proper params when setManualControl is called`, async () => {
        spyOn(MqttClient.prototype, 'makeRequest').and.returnValue(Promise.resolve({}))

        robotAccess.setManualControl(robotData, true)
        await wait(50)

        expect(MqttClient.prototype.makeRequest).toHaveBeenCalledTimes(1)
        expect(MqttClient.prototype.makeRequest).toHaveBeenCalledWith('/aeolus_harm/remote_controller/operation', ['activate'])

        robotAccess.setManualControl(robotData, false)
        await wait(50)

        expect(MqttClient.prototype.makeRequest).toHaveBeenCalledTimes(2)
        expect(MqttClient.prototype.makeRequest).toHaveBeenCalledWith('/aeolus_harm/remote_controller/operation', ['deactivate'])
    })

    it(`should call makeRequest with proper params when getJoints is called`, async () => {
        spyOn(MqttClient.prototype, 'makeRequest').and.returnValue(Promise.resolve({joints: ''}))

        robotAccess.getJoints(robotData)
        await wait(50)

        expect(MqttClient.prototype.makeRequest).toHaveBeenCalled()
        expect(MqttClient.prototype.makeRequest).toHaveBeenCalledWith('/aeolus_harm/remote_controller/joint_list', [])
    })

})

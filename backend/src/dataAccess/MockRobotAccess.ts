import {injectable} from 'inversify'
import {defaultSiteId} from '@config'
import {EVENT_TYPES, eventEmitter} from '@shared'
import {Robot, SimpleStatus, Status} from '@entities'
import {HealthStatusNotification, IRobotAccess} from './types'

const joints: string[] = `
    center/torso_lift center/torso_rotate center/left_wheel center/right_wheel center/head_nod
    center/head_pan left_arm/shoulder_swing left_arm/shoulder_yaw left_arm/shoulder_rotate left_arm/elbow_swing
    left_arm/elbow_rotate left_arm/wrist_swing left_arm/wrist_rotate left_arm/gripper_tf right_arm/shoulder_swing
    right_arm/shoulder_yaw right_arm/shoulder_rotate right_arm/elbow_swing right_arm/elbow_rotate right_arm/wrist_swing
    right_arm/wrist_rotate right_arm/gripper_tf right_arm/gripper_flex left_arm/gripper_flex
`.split(' ')
    .map(s => s.trim())
    .filter(Boolean)

let mockRobots: Robot[] = [
    {
        id: 'WISDJ12',
        model: 'test',
        name: 'R2-D2',
        healthStatus: {
            limitFindingStatus: Status.NOT_RUN_YET,
            manualControl: SimpleStatus.NO,
            emergencyStop: false,
            powerOnSelfTestStatus:  Status.NOT_RUN_YET,
        },
        lastKeepAliveReceivedAt: new Date(),
        joints: [...joints],
    },
    {
        id: 'WISDJ13',
        model: 'test',
        name: 'C-3P0',
        healthStatus: {
            limitFindingStatus:  Status.NOT_RUN_YET,
            manualControl: SimpleStatus.YES,
            emergencyStop: true,
            powerOnSelfTestStatus: Status.OK,
        },
        lastKeepAliveReceivedAt: new Date(),
        joints: [...joints],
    },
]

@injectable()
export class MockRobotAccess implements IRobotAccess {
    private runningLimitFindingTimeoutId: NodeJS.Timeout | null

    constructor() {
        this.runningLimitFindingTimeoutId = null

        mockRobots.forEach((robot, index) => {
            setTimeout(() => {
                eventEmitter.emit(EVENT_TYPES.ROBOT.UPDATED, {
                    robot,
                    siteId: defaultSiteId,
                })

                setInterval(() => {
                    const updatedRobot = {
                        ...mockRobots.find(({id}) => id === robot.id),
                        lastKeepAliveReceivedAt: new Date(),
                    }

                    eventEmitter.emit(EVENT_TYPES.ROBOT.UPDATED, {
                        robot: updatedRobot,
                        siteId: defaultSiteId,
                    })
                }, 2 * 60 * 1000)

            }, (index + 1) * 2000)
        })
    }

    async runLimitFinding(robot: Robot): Promise<void> {
        setTimeout(() => {
            MockRobotAccess.updateRobotLimitFindingStatus(robot, Status.IN_PROGRESS)

            this.runningLimitFindingTimeoutId = setTimeout(() => {
                MockRobotAccess.updateRobotLimitFindingStatus(robot, Status.OK)
            }, 10000)
        }, 1000)
    }

    async cancelLimitFinding(robot: Robot): Promise<void> {
        if (this.runningLimitFindingTimeoutId) {
            clearTimeout(this.runningLimitFindingTimeoutId)
        }

        setTimeout(() => {
            MockRobotAccess.updateRobotLimitFindingStatus(robot,  Status.NOT_RUN_YET)
        }, 500)
    }

    async getJoints(robot: Robot): Promise<string[]> {
        return new Promise(resolve => {
            setTimeout(() => resolve([...joints]), 3000)
        })
    }

    onRobotJoined(
        siteId: string,
        robotData: HealthStatusNotification
    ) {
        const robot = {
            healthStatus: {
                limitFindingStatus: Status.OK,
                manualControl: robotData.manual_control,
                powerOnSelfTestStatus: robotData.power_on_self_test,
            },
            id: robotData.robot_name,
            lastKeepAliveReceivedAt: new Date(),
            model: 'default',
            name: robotData.robot_name,
            joints: [],
        }

        eventEmitter.emit(EVENT_TYPES.ROBOT.UPDATED, {
            robot,
            siteId,
        })
    }

    async moveJoint(robot: Robot, joint: string, isPositiveDirection: boolean) {
        setTimeout(() => {
            eventEmitter.emit(EVENT_TYPES.ROBOT.UPDATED, {
                robot: {
                    ...robot,
                    lastKeepAliveReceivedAt: new Date(),
                },
                siteId: defaultSiteId,
            })
        }, 300)
    }

    async setManualControl(robot: Robot, enabled: boolean) {
        eventEmitter.emit(EVENT_TYPES.ROBOT.UPDATED, {
            robot: {
                ...robot,
                healthStatus: {
                    ...robot.healthStatus,
                    manualControl: SimpleStatus.IN_PROGRESS,
                },
                lastKeepAliveReceivedAt: new Date(),
            },
            siteId: defaultSiteId,
        })

        return new Promise<void>(resolve => {
            setTimeout(() => {
                resolve()
                eventEmitter.emit(EVENT_TYPES.ROBOT.UPDATED, {
                    robot: {
                        ...robot,
                        healthStatus: {
                            ...robot.healthStatus,
                            manualControl: enabled ? SimpleStatus.YES : SimpleStatus.NO,
                        },
                        lastKeepAliveReceivedAt: new Date(),
                    },
                    siteId: defaultSiteId,
                })
            }, 5000)
        })
    }

    private static updateRobotLimitFindingStatus(robot: Robot, newStatus: Status): void {
        const updatedRobot = {
            ...robot,
            healthStatus: {
                ...robot.healthStatus,
                limitFindingStatus: newStatus,
            },
            lastKeepAliveReceivedAt: new Date(),
        }
        mockRobots = mockRobots.map(mockRobot => mockRobot.id === updatedRobot.id ? updatedRobot : mockRobot)
        eventEmitter.emit(EVENT_TYPES.ROBOT.UPDATED, {
            robot: updatedRobot,
            siteId: defaultSiteId,
        })
    }
}

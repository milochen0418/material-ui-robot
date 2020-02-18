import {inject, injectable} from 'inversify'
import {EVENT_TYPES, eventEmitter, getRobotFile, logger} from '@shared'
import {
    Robot,
    RobotFiles,
    RobotFromHealthNotification,
    SimpleStatus,
    Status,
} from '@entities'
import {IRobotAccess, IRobotRepository, TYPES} from '@dataAccess'
import {IRobotService, LIMIT_FINDING_RUN_RESULT, ROBOT_OPERATION_RESULT} from './types'

@injectable()
export class RobotService implements IRobotService {
    constructor(
        @inject(TYPES.RobotRepository) private robotRepository: IRobotRepository,
        @inject(TYPES.RobotAccess) private robotAccess: IRobotAccess,
        private filesByModel: {[model: string]: RobotFiles} = {}
    ) {
        this.handleRobotUpdated = this.handleRobotUpdated.bind(this)
        eventEmitter.on(EVENT_TYPES.ROBOT.UPDATED, this.handleRobotUpdated)
    }

    async getAll(siteId: string): Promise<Robot[]> {
        const robots = await this.robotRepository.getAll(siteId)
        return robots.map(robot => this.extendRobotForClient(robot))
    }

    async moveJoint(siteId: string, robotId: string, joint: string, isPositiveDirection: boolean): Promise<ROBOT_OPERATION_RESULT> {
        const robot = await this.robotRepository.getById(siteId, robotId)
        if (!robot || !robot.joints || !robot.joints.includes(joint)) {
            return ROBOT_OPERATION_RESULT.WRONG_PARAMS
        }

        // just trigger action, no need to wait for it to complete
        this.robotAccess.moveJoint(robot, joint, isPositiveDirection)
        return ROBOT_OPERATION_RESULT.ACCEPTED
    }

    async runLimitFinding(siteId: string, robotId: string): Promise<LIMIT_FINDING_RUN_RESULT | string> {
        const robot = await this.robotRepository.getById(siteId, robotId)
        if (!robot) {
            return LIMIT_FINDING_RUN_RESULT.WRONG_PARAMS
        }

        if (robot.healthStatus.limitFindingStatus === Status.OK) {
            return LIMIT_FINDING_RUN_RESULT.ALREADY_RUN
        }

        await this.robotAccess.runLimitFinding(robot)
        return LIMIT_FINDING_RUN_RESULT.SUCCESS
    }

    async cancelLimitFinding(siteId: string, robotId: string): Promise<void> {
        const robot = await this.robotRepository.getById(siteId, robotId)
        if (!robot) {
            return
        }

        // just trigger action, no need to wait for it to complete
        this.robotAccess.cancelLimitFinding(robot)
    }

    async setManualControl(siteId: string, robotId: string, shouldEnable: boolean): Promise<void> {
        const robot = await this.robotRepository.getById(siteId, robotId)
        if (!robot) {
            throw Error('no robot')
        }

        const targetStatus = shouldEnable ? SimpleStatus.YES : SimpleStatus.NO
        if (robot.healthStatus.manualControl === targetStatus) {
            return
        }

        await this.robotAccess.setManualControl(robot, shouldEnable)
    }

    private async handleRobotUpdated(context: {robot: RobotFromHealthNotification, siteId: string}) {
        const {robot: robotFromHealthStatus, siteId} = context
        const robot = await this.robotFromHealthStatus(robotFromHealthStatus, siteId)
        return this.updateRobot(robot, siteId)
    }

    private extendRobotForClient(robot: Robot): Robot {
        return {
            ...robot,
            files: this.getRobotFiles(robot),
        }
    }

    private getRobotFiles(robot: Robot) {
        if (!this.filesByModel[robot.model] || Object.keys(this.filesByModel[robot.model].joints).length !== robot.joints.length) {
            this.filesByModel[robot.model] = {
                cube: getRobotFile(robot.model, 'cube'),
                joints: robot.joints.reduce((result, joint) => {
                    const jointFile = getRobotFile(robot.model, joint)
                    return {
                        ...result,
                        [joint]: jointFile,
                    }
                }, {}),
            }
        }

        return this.filesByModel[robot.model]
    }

    private async getRobotJoints(robot: Robot, siteId: string) {
       try {
           const joints = await this.robotAccess.getJoints(robot)
           return this.updateRobot({
               ...robot,
               joints: joints || [],
           }, siteId)
       } catch (error) {
           logger.error(error)
       }
    }

    private async updateRobot(robot: Robot, siteId: string) {
        const result = await this.robotRepository.add(siteId, robot)
        eventEmitter.emit(EVENT_TYPES.CLIENT.ROBOT.UPDATED, {
            robot: this.extendRobotForClient(robot),
            siteId,
        })
        return result
    }

    private async robotFromHealthStatus(robotFromHealthNotification: RobotFromHealthNotification, siteId: string): Promise<Robot> {
        const existingRobot = await this.robotRepository.getById(siteId, robotFromHealthNotification.id)
        const robot = {
            ...(existingRobot || {}),
            ...robotFromHealthNotification,
            healthStatus: {
                ...existingRobot?.healthStatus,
                ...robotFromHealthNotification.healthStatus,
            },
            joints: existingRobot?.joints || [],
        }

        if (robot.joints.length === 0) {
            this.getRobotJoints(robot, siteId)
        }

        return robot
    }
}

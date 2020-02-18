import {Robot} from '@entities'

export const TYPES = {
    RobotService: Symbol.for('RobotService'),
}

export enum ROBOT_OPERATION_RESULT {
    ACCEPTED,
    WRONG_PARAMS,
}

export enum LIMIT_FINDING_RUN_RESULT {
    SUCCESS,
    ALREADY_RUN,
    WRONG_PARAMS,
}

export interface IRobotService {
    cancelLimitFinding(siteId: string, robotId: string): Promise<void>
    getAll(siteId: string): Promise<Robot[]>
    moveJoint(siteId: string, robotId: string, joint: string, isPositiveDirection: boolean): Promise<ROBOT_OPERATION_RESULT>
    runLimitFinding(siteId: string, robotId: string): Promise<LIMIT_FINDING_RUN_RESULT | string>
    setManualControl(siteId: string, robotId: string, shouldEnable: boolean): Promise<void>
}

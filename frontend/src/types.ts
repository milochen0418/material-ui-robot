/* tslint:disable:interface-name */
import {Action} from 'redux'

export interface User {
    firstName: string,
    id: string,
    lastName: string,
}

export interface ActionWithRobot extends Action {
    robot: Robot,
}

export enum Status {
    NOT_RUN_YET = 'not_run_yet',
    FAILED = 'failed',
    IN_PROGRESS = 'in_progress',
    OK = 'ok',
}

export enum SimpleStatus {
    NO = 'no',
    IN_PROGRESS = 'in_progress',
    YES = 'yes',
}

export interface Robot {
    id: string
    name: string
    healthStatus: {
        limitFindingStatus: Status,
        manualControl: SimpleStatus
        powerOnSelfTestStatus: Status
    }
    lastKeepAliveReceivedAt?: Date
    joints: string[]
    files: RobotFiles
}

export interface RobotFiles {
    joints: {[jointName: string]: string}
    cube: string
}

export interface LogMessage {
    date: Date,
    message: string,
}

export interface SnackbarMessage {
    message: string,
    type?: 'success' | 'error'
}

export interface Store {
    auth: {
        user?: User,
    },
    app: {
        areLogsOpen: boolean,
        isDrawerOpen: boolean,
        logs: LogMessage[],
        pageOptions: {
            rawPage?: boolean,
        },
        selectedRobot: Robot | null,
        robots: Robot[],
        messages: SnackbarMessage[],
    },
    limitFindingWizard: {
        currentStep: string,
        isNextStepEnabled: boolean,
        isRunningLimitFinding: boolean,
        limitFindingError: string | null,
        limitFindingSuccessful: boolean,
    },
    robotOperations: {
        runningManualControlOperations: {
            [robotId: string]: boolean
        },
    }
}

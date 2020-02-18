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

// tslint:disable-next-line:interface-name
export interface Robot {
    id: string
    model: string
    name: string
    healthStatus: {
        emergencyStop: boolean
        limitFindingStatus: Status,
        manualControl: SimpleStatus
        powerOnSelfTestStatus: Status
    }
    lastKeepAliveReceivedAt?: Date
    joints: string[]
    files?: RobotFiles
}

export interface RobotFromHealthNotification {
    id: string
    model: string
    name: string
    healthStatus: {
        emergencyStop: boolean
        limitFindingStatus: Status,
        manualControl: SimpleStatus
        powerOnSelfTestStatus: Status
    }
    lastKeepAliveReceivedAt?: Date
}

export interface RobotFiles {
    joints: {[jointName: string]: string}
    cube: string
}

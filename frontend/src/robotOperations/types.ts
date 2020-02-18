import {Action} from 'redux'
import {Robot} from 'types'

interface RobotAction extends Action {
    robot: Robot,
}

export interface MoveJointAction extends Action, RobotAction {
    joint: string,
    isPositiveDirection: boolean,
}

export interface SetManualControlAction extends Action, RobotAction {
    enable: boolean,
}

import {buildAction} from 'utils'
import * as constants from './constants'

export const moveJoint = buildAction(constants.MOVE_JOINT, 'robot', 'joint', 'isPositiveDirection')

export const setManualControl = buildAction(constants.SET_MANUAL_CONTROL, 'robot', 'enable')
export const finishManualControl = buildAction(constants.FINISH_MANUAL_CONTROL, 'robot')

import {buildAction} from 'utils'
import * as constants from './constants'

export const goToNextStep = buildAction(constants.NEXT_STEP)
export const goToPreviousStep = buildAction(constants.PREVIOUS_STEP)
export const clear = buildAction(constants.CLEAR)

export const disableNextStep = buildAction(constants.DISABLE_NEXT_STEP)
export const enableNextStep = buildAction(constants.ENABLE_NEXT_STEP)

export const cancelLimitFinding = buildAction(constants.CANCEL_LIMIT_FINDING, 'robot')

export const runLimitFinding = buildAction(constants.RUN_LIMIT_FINDING, 'robot')
export const runLimitFindingError = buildAction(constants.RUN_LIMIT_FINDING_ERROR, 'error')
export const runLimitFindingSuccess = buildAction(constants.RUN_LIMIT_FINDING_SUCCESS)

import {combineReducers, AnyAction} from 'redux'
import * as constants from './constants'

const currentStep = (state = constants.ORDERED_STEPS[1], action: AnyAction): string => {
    switch (action.type) {
        case constants.NEXT_STEP: {
            const currentStepIndex = constants.ORDERED_STEPS.indexOf(state)
            const nextStepIndex = currentStepIndex + 1
            if (constants.ORDERED_STEPS.length > nextStepIndex) {
                return constants.ORDERED_STEPS[nextStepIndex]
            }

            return state
        }
        case constants.PREVIOUS_STEP: {
            const currentStepIndex = constants.ORDERED_STEPS.indexOf(state)
            const nextStepIndex = currentStepIndex - 1
            if (nextStepIndex >= 0) {
                return constants.ORDERED_STEPS[nextStepIndex]
            }

            return state
        }
        case constants.CLEAR:
            return constants.ORDERED_STEPS[1]
        default:
            return state
    }
}

const isNextStepEnabled = (state = true, action: AnyAction): boolean => {
    switch (action.type) {
        case constants.ENABLE_NEXT_STEP:
        case constants.CLEAR:
            return true
        case constants.DISABLE_NEXT_STEP:
            return false
        default:
            return state
    }
}

const limitFindingError = (state: string | null = null, action: AnyAction): string | null => {
    switch (action.type) {
        case constants.RUN_LIMIT_FINDING_ERROR:
            return action.error ? (action.error as string) : 'Unknown error'
        case constants.RUN_LIMIT_FINDING:
        case constants.CLEAR:
            return null
        default:
            return state
    }
}

const limitFindingSuccessful = (state = false, action: AnyAction): boolean => {
    switch (action.type) {
        case constants.RUN_LIMIT_FINDING_SUCCESS:
            return true
        case constants.RUN_LIMIT_FINDING:
        case constants.CLEAR:
            return false
        default:
            return state
    }
}

const isRunningLimitFinding = (state = false, action: AnyAction): boolean => {
    switch (action.type) {
        case constants.RUN_LIMIT_FINDING:
            return true
        case constants.RUN_LIMIT_FINDING_ERROR:
        case constants.RUN_LIMIT_FINDING_SUCCESS:
        case constants.CLEAR:
            return false
        default:
            return state
    }
}

export default combineReducers({
    currentStep,
    isNextStepEnabled,
    isRunningLimitFinding,
    limitFindingError,
    limitFindingSuccessful,
})

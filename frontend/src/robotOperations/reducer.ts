import {combineReducers, AnyAction} from 'redux'
import * as constants from './constants'

const runningManualControlOperations = (
    state: {[robotId: string]: boolean} = {},
    action: AnyAction
): {[robotId: string]: boolean} => {
    switch (action.type) {
        case constants.SET_MANUAL_CONTROL:
            return {
                ...state,
                [action.robot.id]: true,
            }
        case constants.FINISH_MANUAL_CONTROL:
            return {
                ...state,
                [action.robot.id]: false,
            }
        default:
            return state
    }
}

export default combineReducers({
    runningManualControlOperations,
})

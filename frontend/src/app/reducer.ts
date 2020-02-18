import {combineReducers, AnyAction} from 'redux'
import {Robot, SnackbarMessage} from 'types'
import * as constants from './constants'

const pageOptions = (state = {}, action: AnyAction) => {
    switch (action.type) {
        case constants.SET_PAGE_OPTIONS:
            return action.options
        default:
            return state
    }
}

const isDrawerOpen = (state = false, action: AnyAction) => {
    switch (action.type) {
        case constants.TOGGLE_DRAWER:
            return !state
        default:
            return state
    }
}

const robots = (state = [], action: AnyAction) => {
    switch (action.type) {
        case constants.FETCH_ROBOTS_SUCCESS:
            return action.robots
        case constants.ROBOT_UPDATED:
            return state.some((robot: Robot) => robot.id === action.robot.id) ?
                state.map((robot: Robot) => robot.id === action.robot.id ? action.robot : robot) :
                [...state, action.robot]
        default:
            return state
    }
}

const selectedRobot = (state: Robot | null = null, action: AnyAction) => {
    switch (action.type) {
        case constants.FETCH_ROBOTS_SUCCESS:
            return action.robots.length > 0 ? action.robots[0] : null
        case constants.SET_SELECTED_ROBOT:
            return action.robot
        case constants.ROBOT_UPDATED:
            return (state && state.id !== action.robot.id) ? state : action.robot
        default:
            return state
    }
}

const messages = (state: SnackbarMessage[] = [], action: AnyAction) => {
    switch (action.type) {
        case constants.ADD_SNACKBAR_MESSAGE:
            return [...state, {message: action.message, type: action.messageType}]
        case constants.REMOVE_SNACKBAR_MESSAGE: {
            const newArray = [...state]
            newArray.shift()
            return newArray
        }
        default:
            return state
    }
}

export default combineReducers({
    isDrawerOpen,
    messages,
    pageOptions,
    robots,
    selectedRobot,
})

import {buildAction, buildAsyncAction, httpGet} from 'utils'
import * as constants from './constants'

export const toggleDrawer = buildAction(constants.TOGGLE_DRAWER)
export const setPageOptions = buildAction(constants.SET_PAGE_OPTIONS, 'options')
export const setSelectedRobot = buildAction(constants.SET_SELECTED_ROBOT, 'robot')

export const robotUpdated = buildAction(constants.ROBOT_UPDATED, 'robot')

export const fetchRobots = buildAsyncAction({
    isHttpRequest: true,
    returnFieldName: 'robots',
    typeOnError: constants.FETCH_ROBOTS_ERROR,
    typeOnSuccess: constants.FETCH_ROBOTS_SUCCESS,
    typeStarted: constants.FETCH_ROBOTS,
}, () => httpGet('robot'))

export const addSnackbarMessage = buildAction(constants.ADD_SNACKBAR_MESSAGE, 'message', 'messageType')
export const removeSnackbarMessage = buildAction(constants.REMOVE_SNACKBAR_MESSAGE)

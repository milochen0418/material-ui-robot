import {ThunkDispatch} from 'redux-thunk'
import {AnyAction} from 'redux'
import {httpGet} from 'utils'
import {serverUrl, fakeSiteId} from 'config'
import {Robot} from 'types'
import {robotUpdated} from 'app'
import {EVENT_TYPES} from './constants'

const handleRobotAdded = (dispatch: ThunkDispatch<{}, {}, AnyAction>, eventData: {robot: Robot, siteId: string}) => {
    dispatch(robotUpdated(eventData.robot))
}

interface EventWithData extends Event {
    data: string
}

export const initEventListener = async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const eventListenerUrl = `${serverUrl}/api/${fakeSiteId}/events/listen`
    await httpGet('events/init', fakeSiteId)
    const eventSource = new EventSource(eventListenerUrl, {withCredentials: true})
    eventSource.addEventListener(EVENT_TYPES.ROBOT.UPDATED, (event) => {
        handleRobotAdded(dispatch, JSON.parse((event as EventWithData).data))
    })
}

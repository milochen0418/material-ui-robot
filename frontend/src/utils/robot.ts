import moment from 'moment'
import {Robot, Status} from 'types'

export const isRobotOnline = (robot: Robot) => {
    const fiveMinutesAgo = moment().add(-5, 'minutes')
    return Boolean(robot.lastKeepAliveReceivedAt) && moment(robot.lastKeepAliveReceivedAt).isAfter(fiveMinutesAgo)
}

export const getStatusLocalizationKey = (status: Status): string => {
    switch (status) {
        case Status.NOT_RUN_YET:
        case Status.FAILED:
            return 'NOK'
        case Status.IN_PROGRESS:
            return 'In progress'
        case Status.OK:
            return 'OK'
        default:
            return ''
    }
}

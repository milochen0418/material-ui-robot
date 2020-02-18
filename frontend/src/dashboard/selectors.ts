import {createSelector} from 'reselect'
import {Robot, SimpleStatus, Status} from 'types'
import {getSelectedRobot} from 'app'
import {isRobotOnline} from 'utils'

export const getActions = createSelector(
    getSelectedRobot,
    (robot: Robot | null) => {
        if (robot === null) {
            return []
        }

        const isOnline = isRobotOnline(robot)
        if (!isOnline) {
            return []
        }

        const actions = []
        if (
            robot.healthStatus.limitFindingStatus === Status.NOT_RUN_YET ||
            robot.healthStatus.limitFindingStatus === Status.FAILED
        ) {
            actions.push({
                actionKey: 'startLimitFinding',
                disabledReason: robot.healthStatus.manualControl === SimpleStatus.YES ?
                    undefined :
                    'Robot is not in manual control mode',
                localeKey: 'Start Limit Finding',
                main: true,
            })
        } else if (robot.healthStatus.limitFindingStatus === Status.IN_PROGRESS) {
            actions.push({
                localeKey: 'Limit finding in progress',
                main: true,
            })
        }

        return actions
    }
)

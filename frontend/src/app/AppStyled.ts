import CoreBadge from '@material-ui/core/Badge'
import {withStyles} from '@material-ui/core/styles'
import styled from 'styled-components'
import {isRobotOnline} from 'utils'
import {Robot, Status} from 'types'
import {DRAWER_WIDTH} from './constants'
import {secondaryHeader, background} from '../colors'

export const App = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: ${background};
`

export const ToolbarTitle = styled.div`
    flex-grow: 1;
    font-weight: 600;
`

export const Content = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
    margin-left: ${(props: {isDrawerOpen: boolean}) => props.isDrawerOpen ? 0 : `-${DRAWER_WIDTH}px`};
    transition: margin 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,width 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;
`

export const DrawerSectionTitle = styled.div`
    color: ${secondaryHeader};
    padding: 8px 16px 0 16px;
    font-weight: 600;
    font-size: 0.75rem;
`

const getBadgeColorForRobot = (robot?: Robot) => {
    if (!robot) {
        return undefined
    }

    if (!isRobotOnline(robot)) {
        return '#ff0300'
    }

    if (robot.healthStatus.limitFindingStatus === Status.OK) {
        return '#05cc3c'
    }

    if (robot.healthStatus.limitFindingStatus === Status.IN_PROGRESS) {
        return '#cc8d19'
    }

    if (
        robot.healthStatus.limitFindingStatus === Status.FAILED ||
        robot.healthStatus.limitFindingStatus === Status.NOT_RUN_YET
    ) {
        return '#1865e7'
    }

    return undefined
}

export const Badge = withStyles(theme => ({
    badge: (props: {robot: Robot}) => ({
        backgroundColor: getBadgeColorForRobot(props.robot),
        right: -10,
        top: 15,
    }),
}))(CoreBadge)

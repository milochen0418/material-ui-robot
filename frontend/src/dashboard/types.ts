import {Robot} from 'types'
import {types} from 'components'

export interface DashboardProps {
    robot: Robot | null,
}

export interface RobotActionsCardProps extends DashboardProps {
    actions: types.CardAction[]
    availableActions: types.AvailableActions,
}

export interface RobotStatusCardProps extends DashboardProps {
    isChangingManualMode: boolean,
    setManualControl: (robot: Robot, enabled: boolean) => void,
}

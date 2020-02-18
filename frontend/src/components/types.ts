import {LogMessage} from 'types'

export interface CardAction {
    actionKey?: string,
    disabledReason?: string,
    localeKey: string,
    main?: boolean,
}

export interface AvailableActions {
    [actionKey: string]: CallableFunction,
}

export interface CardActionProps {
    action: CardAction,
    availableActions: AvailableActions,
}

export interface LogsControlProps {
    initLogListener: (robotId: string, onNewMessage: (message: LogMessage | LogMessage[]) => void) => EventSource,
    robotId: string,
}

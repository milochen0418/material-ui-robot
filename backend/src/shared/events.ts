import events from 'events'

const eventEmitter = new events.EventEmitter()

const EVENT_TYPES = {
    ROBOT: {
        UPDATED: 'ROBOT_UPDATED',
    },
    CLIENT: {
        ROBOT: {
            UPDATED: 'CLIENT_ROBOT_UPDATED',
        },
    },
}

export {
    eventEmitter,
    EVENT_TYPES,
}

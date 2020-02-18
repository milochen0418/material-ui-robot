import {logger} from '@shared'

export function prepareMessage(method: string, message: object, id: string): string {
    const preparedMessage = {
        data: {
            jsonrpc: '2.0',
            id,
            method,
            params: message,
        },
    }

    return JSON.stringify(preparedMessage)
}

// tslint:disable-next-line:no-any
export function getDataFromMessage(message: Buffer): any {
    try {
        const messageAsString = message.toString()
        const messageObject = JSON.parse(messageAsString)
        return messageObject.data ? messageObject.data : messageObject
    } catch (error) {
        logger.warn('cannot parse message', message.toString())
    }

    return {}
}

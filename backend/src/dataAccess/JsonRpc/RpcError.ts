export interface IRpcError {
    code: number
    message: string
    // tslint:disable-next-line
    data?: any
    // Note: result can be really anything (impossible to predict all possible types)
}

export const ERROR_CODES: Record<number, string> = {
    '-32700': 'Parse error',
    '-32600': 'Invalid Request',
    '-32601': 'Method not found',
    '-32602': 'Invalid params',
    '-32603': 'Internal error',
}

export class RpcError implements IRpcError {
    constructor(obj: IRpcError) {
        this.code = obj.code
        this.message = obj.message
        this.data = obj.data
    }

    static fromErrorCode(errorCode: number): RpcError {
        return new RpcError({ code: errorCode, message: ERROR_CODES[errorCode] })
    }

    isServerError(): boolean {
        return (this.code <= -32000) && (this.code >= -32099)
    }

    code: number
    message: string
    // tslint:disable-next-line
    data?: any
}

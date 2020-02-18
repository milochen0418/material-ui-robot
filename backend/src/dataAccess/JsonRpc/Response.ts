import {IJsonRpcGeneric, JsonRpcGeneric} from './JsonRpcGeneric'
import {IRpcError, RpcError} from './RpcError'

export interface IResponse extends IJsonRpcGeneric {
    // tslint:disable-next-line
    result?: any
    // Note: result can be really anything (impossible to predict all possible types)
    error?: IRpcError
    id: string | number | null
}

export class Response extends JsonRpcGeneric implements IResponse {
    constructor(obj: IResponse) {
        super(obj)
        this.id = obj.id
        this.result = obj.result
        if (obj.error) {
            this.error = new RpcError(obj.error)
        }
        this.validate()
    }

    isError(): boolean {
        return this.error !== undefined
    }

    validate(): void {
        super.validate()
        if (this.result && this.error) {
            throw new Error('Has result and error')
        }
        if (!this.result && !this.error) {
            throw new Error('No error and no result')
        }
        if (this.result && !this.id) {
            throw new Error('Result must have an id')
        }
    }

    // tslint:disable-next-line
    result?: any
    error?: RpcError
    id: string | number | null
}

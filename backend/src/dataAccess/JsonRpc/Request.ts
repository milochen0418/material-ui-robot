import {IJsonRpcGeneric, JsonRpcGeneric} from './JsonRpcGeneric'

export interface IRequest extends IJsonRpcGeneric {
    method: string
    // tslint:disable-next-line
    params?: any[]
    // Note: params is really array of any (impossible to predict all possible types)
    id?: string | number | null
}

export class Request extends JsonRpcGeneric implements IRequest {
    constructor(obj: IRequest) {
        super(obj)
        this.id = obj.id
        this.method = obj.method
        if (obj.params) {
            this.params = obj.params
        }
        this.validate()
    }

    validate(): void {
        super.validate()
        if ((this.id !== undefined) && (this.id !== null) &&
            (typeof (this.id) !== 'string') && (typeof (this.id) !== 'number')) {
            throw new Error('Invalid id type')
        }
        if (this.params && (!Array.isArray(this.params))) {
            throw Error('Invalid params type')
        }
        if (typeof (this.method) !== 'string') {
            throw Error('Method must be an string')
        }
    }

    isNotification(): boolean {
        return this.id === undefined
    }

    method: string
    // tslint:disable-next-line
    params?: any[]
    id?: string | number | null
}

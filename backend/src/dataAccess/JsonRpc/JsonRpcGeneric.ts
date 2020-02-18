export interface IJsonRpcGeneric {
    jsonrpc: string
}

export abstract class JsonRpcGeneric implements IJsonRpcGeneric {
    constructor(obj: IJsonRpcGeneric = { jsonrpc: '2.0' }) {
        this.jsonrpc = obj.jsonrpc
    }

    validate(): void {
        if (this.jsonrpc !== '2.0') {
            throw new Error('Incompatible JSON-RPC object version')
        }
    }

    isValid(): boolean {
        try {
            this.validate()
        } catch (error) {
            return false
        }
        return true
    }

    jsonrpc: string
}

export function createFromString<T, K extends T>(ctor: new (obj: K) => T, str: string): T {
    return new ctor(JSON.parse(str))
}

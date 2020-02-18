import * as JsonRpc from '../../src/dataAccess/JsonRpc'

describe('JsonRpc', () => {
    it(`Request can be constructed with all allowed id types`, () => {
        const obj1: JsonRpc.IRequest = { jsonrpc: '2.0', id: 1, method: 'add', params: [1, 2] }
        const req1 = new JsonRpc.Request(obj1)
        const obj2: JsonRpc.IRequest = { jsonrpc: '2.0', id: '1', method: 'add', params: [1, 2] }
        const req2 = new JsonRpc.Request(obj2)
        const obj3: JsonRpc.IRequest = { jsonrpc: '2.0', id: null, method: 'add', params: [1, 2] }
        const req3 = new JsonRpc.Request(obj3)
        const obj4: JsonRpc.IRequest = { jsonrpc: '2.0', method: 'add', params: [1, 2] }
        const req4 = new JsonRpc.Request(obj4)
        expect(req1.id).toEqual(1)
        expect(req2.id).toEqual('1')
        expect(req3.id).toEqual(null)
        expect(req4.id).toEqual(undefined)
    })

    it(`Request can be constructed from string`, () => {
        const str = '{ "jsonrpc": "2.0", "id": "1", "method": "add", "params": [1, 2] }'
        const req = JsonRpc.createFromString(JsonRpc.Request, str)
        expect(req.params![0]).toEqual(1)
    })

    it(`Response can be constructed from string`, () => {
        const str = '{ "jsonrpc": "2.0", "id": "1", "result": 1 }'
        const res = JsonRpc.createFromString(JsonRpc.Response, str)
        expect(res.result).toEqual(1)
    })

    it(`Invalid request can't be constructed`, () => {
        const str1 = '{ "jsonrpc": "2.0", "id": [1], "method": "m", "params": [] }' // id is array
        const str2 = '{ "jsonrpc": "2.0", "id": 1, "method": "m", "params": 1 }' // params is number
        const str3 = '{ "jsonrpc": "2.0", "id": 1, "method": 1, "params": [1] }' // method is number
        const str4 = '{ "jsonrpc": "2.1", "id": 1, "method": "1", "params": [1] }' // v2.1
        expect(() => { JsonRpc.createFromString(JsonRpc.Request, str1) })
            .toThrow(new Error('Invalid id type'))
        expect(() => { JsonRpc.createFromString(JsonRpc.Request, str2) })
            .toThrow(new Error('Invalid params type'))
        expect(() => { JsonRpc.createFromString(JsonRpc.Request, str3) })
            .toThrow(new Error('Method must be an string'))
        expect(() => { JsonRpc.createFromString(JsonRpc.Request, str4) })
            .toThrow(new Error('Incompatible JSON-RPC object version'))
    })

    it(`Invalid response can't be constructed`, () => {
        const str1 = '{ "jsonrpc": "2.0", "id": "1", "result": 1 ' // invalid json
        const str2 = '{ "jsonrpc": "2.0", "id": "1" }' // no result, no error
        const str3 = '{ "jsonrpc": "2.0", "id": "1", "result": 1, "error": {"code": 1, "msg": "abc"}}' // result and error
        const str4 = '{ "jsonrpc": "2.0", "result": 1}'
        expect(() => { JsonRpc.createFromString(JsonRpc.Response, str1) })
            .toThrow(new SyntaxError('Unexpected end of JSON input'))
        expect(() => { JsonRpc.createFromString(JsonRpc.Response, str2) })
            .toThrow(new Error('No error and no result'))
        expect(() => { JsonRpc.createFromString(JsonRpc.Response, str3) })
            .toThrow(new Error('Has result and error'))
        expect(() => { JsonRpc.createFromString(JsonRpc.Response, str4) })
            .toThrow(new Error('Result must have an id'))
    })

    it(`Error can be created from error code`, () => {
        const err = JsonRpc.RpcError.fromErrorCode(-32700)
        expect(err.message).toEqual('Parse error')
    })

    it(`Server error can be detected`, () => {
        const err1 = new JsonRpc.RpcError({ code: -31999, message: 'abc' })
        const err2 = new JsonRpc.RpcError({ code: -32000, message: 'abc' })
        const err3 = new JsonRpc.RpcError({ code: -32050, message: 'abc' })
        const err4 = new JsonRpc.RpcError({ code: -32099, message: 'abc' })
        const err5 = new JsonRpc.RpcError({ code: -32100, message: 'abc' })
        expect(err1.isServerError()).toEqual(false)
        expect(err2.isServerError()).toEqual(true)
        expect(err3.isServerError()).toEqual(true)
        expect(err4.isServerError()).toEqual(true)
        expect(err5.isServerError()).toEqual(false)
    })

    it(`Notifications can be detected`, () => {
        const nonNotificationReq = new JsonRpc.Request({ jsonrpc: '2.0', id: 1, method: 'add', params: [1, 2] })
        const notificationReq = new JsonRpc.Request({ jsonrpc: '2.0', method: 'add', params: [1, 2] })
        expect(nonNotificationReq.isNotification()).toEqual(false)
        expect(notificationReq.isNotification()).toEqual(true)
    })

    it(`Error response can be detected`, () => {
        const errorRes = new JsonRpc.Response({ jsonrpc: '2.0', error: { code: 123, message: '123' }, id: null})
        const nonErrorRes = new JsonRpc.Response({ jsonrpc: '2.0', result: 1 , id: 1})
        expect(errorRes.isError()).toEqual(true)
        expect(nonErrorRes.isError()).toEqual(false)
    })
})

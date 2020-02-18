import * as mqttUtils from '../../src/dataAccess/mqttUtils'

describe('mqttUtils', () => {
    it(`should properly prepare MQTT request`, () => {
        const method = 'testMethod'
        const message = {field: 'test123', another: 12.12}
        const requestId = 'requestIdValue'

        const expectedValue = {
            data: {
                jsonrpc: '2.0',
                method,
                id: requestId,
                params: message,
            },
        }

        const stringMessage = mqttUtils.prepareMessage(method, message, requestId)

        expect(JSON.parse(stringMessage)).toEqual(expectedValue)
    })

    it(`should return proper data for message from buffer`, () => {
        const objectWithData = {
            data: {
                test: '1a',
                another: 12.12,
            },
        }
        const objectWithoutData = {
            someObject: true,
        }

        expect(mqttUtils.getDataFromMessage(Buffer.from('non object'))).toEqual({})
        expect(mqttUtils.getDataFromMessage(Buffer.from(JSON.stringify(objectWithoutData)))).toEqual({someObject: true})
        expect(mqttUtils.getDataFromMessage(Buffer.from(JSON.stringify(objectWithData)))).toEqual(objectWithData.data)
    })
})

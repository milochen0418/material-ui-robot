import {serverUrl, fakeJWTToken, fakeSiteId} from 'config'

export function httpGet(endpoint: string, siteId?: string) {
    return fetch(getPath(endpoint, siteId), getOptions('GET'))
}

export function httpPost(endpoint: string, data?: {}, siteId?: string) {
    return fetch(getPath(endpoint, siteId), getOptions('POST', data))
}

export function httpPut(endpoint: string, data?: {}, siteId?: string) {
    return fetch(getPath(endpoint, siteId), getOptions('PUT', data))
}

export function httpDelete(endpoint: string, siteId?: string) {
    return fetch(getPath(endpoint, siteId), getOptions('DELETE'))
}

function getPath(endpoint: string, siteId = fakeSiteId) {
    return `${serverUrl}/api/${siteId}/${endpoint}`
}

function getOptions(verb: string, data?: {}) {
    const options = {
        credentials: 'include',
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${fakeJWTToken}`,
            'Content-Type': 'application/json',
        },
        method: verb,
    } as {[field: string]: string | {}}
    if (data) {
        options.body = JSON.stringify(data)
    }

    return options
}

// tslint:disable-next-line:no-any
export async function getResponseBody(response: Response): Promise<any> {
    try {
        const body = await response.json()
        return body
    } catch (error) {
        return {}
    }
}

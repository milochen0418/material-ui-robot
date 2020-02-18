import CryptoJS, {WordArray} from 'crypto-js'
import {JWT_SECRET} from '@config'

// based on https://www.jonathan-petitcolas.com/2014/11/27/creating-json-web-token-in-javascript.html
function base64url(source: string | WordArray) {
    let encodedSource = CryptoJS.enc.Base64.stringify(source)

    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '')

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-')
    encodedSource = encodedSource.replace(/\//g, '_')

    return encodedSource
}

export const createTestJWT = (userId = '1', firstName = 'John', lastName = 'Doe') => {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    }

    const data = {
        id: userId,
        firstName,
        lastName,
    }

    const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header))
    const encodedHeader = base64url(stringifiedHeader)

    const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data))
    const encodedData = base64url(stringifiedData)

    const signature = CryptoJS.HmacSHA256(`${encodedHeader}.${encodedData}`, JWT_SECRET)
    const encodedSignature = base64url(signature)

    return `${encodedHeader}.${encodedData}.${encodedSignature}`
}

export const wait = (milliseconds = 50) => new Promise(resolve => setTimeout(resolve, milliseconds))

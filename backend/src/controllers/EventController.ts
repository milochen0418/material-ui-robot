import {Router} from 'express'
import {OK} from 'http-status-codes'
import jwt from 'jsonwebtoken'
import {PERMISSIONS, eventEmitter, EVENT_TYPES} from '@shared'
import {Robot} from '@entities'
import {JWT_SECRET, allowInsecureCookies} from '@config'
import {EnhancedRequest} from './types'
import {authWithPermissions} from './middlewares'

const controller = Router()

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Events setup
 */

/**
 * @swagger
 * path:
 *  /{siteId}/events/init:
 *    get:
 *      summary: Get all robots. Requires ROBOT_GET_DEVICES user permission
 *      tags: [Events]
 *      security:
 *          - jwtToken: []
 *      parameters:
 *          - $ref: '#/components/parameters/siteId'
 *      responses:
 *        "200":
 *          description: Response with cookies for auth set
 */
controller.get('/init', authWithPermissions(PERMISSIONS.ROBOT.GET_DEVICES), async (request, response) => {
    const expires = new Date()
    const halfHoursInMillis = 30 * 60 * 1000
    expires.setTime(expires.getTime() + halfHoursInMillis)

    response.cookie(
        'jwt',
        jwt.sign(request.user as object, JWT_SECRET),
        {
            expires,
            httpOnly: true,
            sameSite: false,
            secure: !allowInsecureCookies,
            signed: true,
        })
    return response.sendStatus(OK)
})

/**
 * @swagger
 * path:
 *  /{siteId}/events/listen:
 *    get:
 *      summary: Event stream for pushing updates from server to the client
 *      tags: [Events]
 *      parameters:
 *          - $ref: '#/components/parameters/siteId'
 *          - in: cookie
 *            name: jwt
 *            schema:
 *               type: string
 *      responses:
 *        "200":
 *          description: Pushes events to the client. Currently supported events are - CLIENT_ROBOT_UPDATED.
 */
controller.get('/listen', authWithPermissions(PERMISSIONS.ROBOT.GET_DEVICES), async (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'keep-alive',
    })

    const {siteId} = request as EnhancedRequest
    const robotUpdatedCallback = (context: {robot: Robot, siteId: string}) => {
        if (context.siteId !== siteId) {
            return
        }

        const dataForClient = createEventData(EVENT_TYPES.CLIENT.ROBOT.UPDATED, context)
        response.write(dataForClient)
    }

    eventEmitter.on(EVENT_TYPES.CLIENT.ROBOT.UPDATED, robotUpdatedCallback)
    response.on('close', () => {
        eventEmitter.removeListener(EVENT_TYPES.CLIENT.ROBOT.UPDATED, robotUpdatedCallback)
        response.end()
    })
})

const createEventData = (eventType: string, data: object) => `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`

export default controller

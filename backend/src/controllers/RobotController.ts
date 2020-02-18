import {Router} from 'express'
import {BAD_REQUEST, NOT_MODIFIED, OK} from 'http-status-codes'
import {logger, PERMISSIONS} from '@shared'
import Container from '@container'
import {IRobotService, LIMIT_FINDING_RUN_RESULT, ROBOT_OPERATION_RESULT, TYPES} from '@services'
import {EnhancedRequest} from './types'
import {authWithPermissions} from './middlewares'

const controller = Router()
const robotService = Container.get<IRobotService>(TYPES.RobotService)

/**
 * @swagger
 * tags:
 *   name: Robot
 *   description: Robot management
 */

/**
 * @swagger
 * path:
 *  /{siteId}/robot/:
 *    get:
 *      summary: Get all robots. Requires ROBOT_GET_DEVICES user permission
 *      tags: [Robot]
 *      security:
 *          - jwtToken: []
 *      parameters:
 *          - $ref: '#/components/parameters/siteId'
 *      responses:
 *        "200":
 *          description: An array of robots available for user
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Robot'
 */
controller.get('/', authWithPermissions(PERMISSIONS.ROBOT.GET_DEVICES), async (request, response) => {
    try {
        const robots = await robotService.getAll((request as EnhancedRequest).siteId)
        return response.status(OK).json(robots)
    } catch (err) {
        logger.error(err)
        return response.status(BAD_REQUEST).json({
            error: err.message,
        })
    }
})

/**
 * @swagger
 * path:
 *  /{siteId}/robot/{robotId}/runLimitFinding:
 *    post:
 *      summary: Run limit finding for robot with id `robotId` from site with id `siteId`. Requires ROBOT_RUN_LIMIT_FINDING user permission
 *      tags: [Robot]
 *      security:
 *          - jwtToken: []
 *      parameters:
 *          - $ref: '#/components/parameters/siteId'
 *          - $ref: '#/components/parameters/robotId'
 *      responses:
 *        "200":
 *          description: Limit finding routine started
 *        "304":
 *          description: Limit finding routine already run
 *        "400":
 *          description: No robot found for given params
 */
controller.post('/:robotId/runLimitFinding', authWithPermissions(PERMISSIONS.ROBOT.RUN_LIMIT_FINDING), async (request, response) => {
    try {
        const result = await robotService.runLimitFinding((request as EnhancedRequest).siteId, request.params.robotId)
        if (result === LIMIT_FINDING_RUN_RESULT.WRONG_PARAMS) {
            return response.sendStatus(BAD_REQUEST)
        } else if (result === LIMIT_FINDING_RUN_RESULT.ALREADY_RUN) {
            return response.sendStatus(NOT_MODIFIED)
        }

        return response.sendStatus(OK)
    } catch (err) {
        logger.error(err)
        return response.status(BAD_REQUEST).json({
            error: err.message,
        })
    }
})

/**
 * @swagger
 * path:
 *  /{siteId}/robot/{robotId}/cancelLimitFinding:
 *    post:
 *      summary: Cancel limit finding routing for robot with id `robotId` from site with id `siteId`. Requires ROBOT_RUN_LIMIT_FINDING user permission
 *      tags: [Robot]
 *      security:
 *          - jwtToken: []
 *      parameters:
 *          - $ref: '#/components/parameters/siteId'
 *          - $ref: '#/components/parameters/robotId'
 *      responses:
 *        "200":
 *          description: Message to cancel limit finding sent to the robot
 */
controller.post('/:robotId/cancelLimitFinding', authWithPermissions(PERMISSIONS.ROBOT.RUN_LIMIT_FINDING), async (request, response) => {
    try {
        await robotService.cancelLimitFinding((request as EnhancedRequest).siteId, request.params.robotId)
        return response.sendStatus(OK)
    } catch (err) {
        logger.error(err)
        return response.status(BAD_REQUEST).json({
            error: err.message,
        })
    }
})

/**
 * @swagger
 * path:
 *  /{siteId}/robot/{robotId}/setManualControl:
 *    post:
 *      summary: Tries to send change manual control state of the robot
 *      tags: [Robot]
 *      security:
 *          - jwtToken: []
 *      parameters:
 *          - $ref: '#/components/parameters/siteId'
 *          - $ref: '#/components/parameters/robotId'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          enable:
 *                              type: boolean
 *      responses:
 *        "200":
 *          description: Update Successful
 *        "400":
 *          description: No robot found for given params or request wasn't successful
 */
controller.post('/:robotId/setManualControl', authWithPermissions(PERMISSIONS.ROBOT.CHANGE_MANUAL_CONTROL), async (request, response) => {
    try {
        const {enable} = request.body
        const {robotId} = request.params
        await robotService.setManualControl((request as EnhancedRequest).siteId, robotId, enable)
        return response.sendStatus(OK)
    } catch (err) {
        logger.error(err)
        return response.status(BAD_REQUEST).json({
            error: err.message,
        })
    }
})

/**
 * @swagger
 * path:
 *  /{siteId}/robot/{robotId}/moveJoint:
 *    post:
 *      summary: Cancel limit finding routing for robot with id `robotId` from site with id `siteId`. Requires ROBOT_RUN_LIMIT_FINDING user permission
 *      tags: [Robot]
 *      security:
 *          - jwtToken: []
 *      parameters:
 *          - $ref: '#/components/parameters/siteId'
 *          - $ref: '#/components/parameters/robotId'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          joint:
 *                              type: string
 *                          isPositiveDirection:
 *                              type: boolean
 *      responses:
 *        "200":
 *          description: Message to cancel limit finding sent to the robot
 *        "400":
 *          description: No robot found for given params
 */
controller.post('/:robotId/moveJoint', authWithPermissions(PERMISSIONS.ROBOT.RUN_LIMIT_FINDING), async (request, response) => {
    try {
        const {joint, isPositiveDirection} = request.body
        const {robotId} = request.params
        const result = await robotService.moveJoint((request as EnhancedRequest).siteId, robotId, joint, isPositiveDirection)
        if (result === ROBOT_OPERATION_RESULT.WRONG_PARAMS) {
            return response.sendStatus(BAD_REQUEST)
        }
        return response.sendStatus(OK)
    } catch (err) {
        logger.error(err)
        return response.status(BAD_REQUEST).json({
            error: err.message,
        })
    }
})

export default controller

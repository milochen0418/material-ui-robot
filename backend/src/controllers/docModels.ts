/**
 * @swagger
 *  components:
 *    securitySchemes:
 *      jwtToken:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *    parameters:
 *      siteId:
 *          in: path
 *          name: siteId
 *          required: true
 *          schema:
 *              type: string
 *          description: id of the site for which we are currently operating
 *      robotId:
 *          in: path
 *          name: robotId
 *          required: true
 *          schema:
 *              type: string
 *          description: id of the robot on which we are currently operating
 *    schemas:
 *      RobotHealthStatus:
 *        type: object
 *        properties:
 *          limitFindingStatus:
 *            type: string
 *            enum: [yes, no, inProgress]
 *        example:
 *           limitFindingStatus: inProgress
 *      Robot:
 *        type: object
 *        required:
 *          - name
 *          - email
 *        properties:
 *          id:
 *            type: string
 *          model:
 *            type: string
 *          name:
 *            type: string
 *          lastKeepAliveReceivedAt:
 *            type: Date
 *          healthStatus:
 *            $ref: '#/components/schemas/RobotHealthStatus'
 *          joints:
 *            type: array
 *            items:
 *              type: string
 *            description: Joints available for the robot.
 *          files:
 *            type: object
 *            description: JPG files related to robot
 *            properties:
 *              cube:
 *                  type: string
 *                  description: JPG with robot within a 2m cube
 *              joints:
 *                  type: object
 *                  description: Map from joint name to JPG with target position for joint
 *        example:
 *           id: "WO98DKWZ"
 *           model: "Test-1"
 *           name: "R2-D2"
 *           lastKeepAliveReceivedAt: ""
 *           healthStatus: {}
 *           joints: []
 *           files: {cube: "/api/files/models/default/cube.jpg", joints: {left_arm: "/api/files/models/default/left_arm.jpg"}}
 */

import express from 'express'
import RobotController from './RobotController'
import EventController from './EventController'
import {EnhancedRequest} from './types'
import docs from './docs'

// Init router and path
const router = express.Router()

router.param('siteId', (request, response, next, siteId) => {
    (request as EnhancedRequest).siteId = siteId
    next()
})

// Add sub-routes
router.use('/files', express.static('public'))
router.use('/docs', docs)
router.use('/:siteId/events', EventController)
router.use('/:siteId/robot', RobotController)

// Export the base-router
export default router

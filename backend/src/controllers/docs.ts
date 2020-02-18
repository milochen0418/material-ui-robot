import {Router} from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import {url} from '@config'

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'User Infrastructure API docs',
            version: '1.0.0',
            description:
                'Documentation for endpoints used in User Infrastructure API project',
            license: {
                name: 'UNLINCENSED',
            },
        },
        servers: [
            {
                url,
            },
        ],
    },
    apis: ['**/*.ts'],
}

const specs = swaggerJsdoc(options)

const controller = Router()

controller.use('/', swaggerUi.serve)

controller.get('/', swaggerUi.setup(specs, {
    isExplorer: true,
}))

export default controller

import 'reflect-metadata'
import cookieParser from 'cookie-parser'
import express from 'express'
import { Request, Response } from 'express'
import logger from 'morgan'
import cors from 'cors'
import passport from 'passport'
import {corsEnabled, JWT_SECRET, allowedOrigins} from './Config'
import BaseRouter from './controllers'
import Container from './inversify.config'
import {IRobotAccess, TYPES} from './dataAccess'

// Init express
const app = express()

// Add middleware/settings/routes to express.
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser(JWT_SECRET))
app.use(passport.initialize())

// initialize robot access
const robotAccess = Container.get<IRobotAccess>(TYPES.RobotAccess)

if (corsEnabled) {
    app.use(cors({
        origin: allowedOrigins,
        credentials: true,
    }))
}

app.use('/api', BaseRouter)

app.get('*', (req: Request, res: Response) => {
    res.sendStatus(404)
})

// Export express instance
export default app

import {Request} from 'express'
import passport from 'passport'
import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt'
import {JWT_SECRET} from '@config'

const extractFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()
const extractJwt = (request: Request) => {
    let token = extractFromHeader(request)
    if (token) {
        return token
    }

    token = request.signedCookies.jwt
    if (token) {
        return token
    }

    return null
}

const jwtOpts = {
    jwtFromRequest: extractJwt,
    secretOrKey: JWT_SECRET,
}

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
    try {
        const [fullName, ...lastNameParts] = (payload.name || '').split(' ')
        // TODO: when we store users in db it should be checked if they are in our system
        const user = {
            id: payload.sub,
            firstName: fullName[0],
            lastName: lastNameParts.join(' '),
        }

        if (!user) {
            return done(null, false)
        }
        return done(null, user)
    } catch (e) {
        return done(e, false)
    }
})

passport.use(jwtStrategy)

const authJwt = passport.authenticate('jwt', { session: false })

// TODO: To be extended in the future when we add permissions handling
// when it's implemented it should be tested!
export const authWithPermissions = (requiredUserPermissions: string[] | string) => authJwt

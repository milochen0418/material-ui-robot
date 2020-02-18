import './LoadEnv' // Must be the first import
import https from 'https'
import fs from 'fs'
import app from '@server'
import {logger} from '@shared'
import {port, certFile, certKeyFile} from '@config'

const startCallback = () => {
    logger.info('Express server started on port: ' + port)
}

if (certFile && certKeyFile) {
    https
        .createServer({
            key: fs.readFileSync('server.key'),
            cert: fs.readFileSync('server.cert'),
        }, app)
        .listen(port, startCallback)
} else {
    app.listen(port, startCallback)
}

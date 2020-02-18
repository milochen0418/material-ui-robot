export const port = Number(process.env.PORT || 3000)

export const publicPort = Number(process.env.PUBLIC_PORT || port)

export const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const url = `http://localhost:${publicPort}/api`

export const defaultSiteId = process.env.DEFAULT_SIDE_ID || 'testSite'

export const corsEnabled = process.env.CORS_ENABLED === 'true'

export const allowInsecureCookies = process.env.ALLOW_INSECURE_COOKIES === 'true'

export const allowedOrigins = process.env.ALLOWED_ORIGINS ? JSON.parse(process.env.ALLOWED_ORIGINS) : '*'

export const mqttHost = process.env.MQTT_HOST || '127.0.0.1'

export const mqttPort = process.env.MQTT_PORT

export const mqttProtocol = process.env.MQTT_PROTOCOL || 'mqtt'

export const checkMqttItemsIntervalTimeout = process.env.CHECK_ITEMS_INTERVAL_TIMEOUT ?
    Number(process.env.CHECK_ITEMS_INTERVAL_TIMEOUT) :
    1000 * 20

export const certKeyFile = process.env.CERT_KEY_FILE
export const certFile = process.env.CERT_FILE

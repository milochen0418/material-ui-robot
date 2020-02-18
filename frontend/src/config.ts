const env = (window as unknown as {_env_: {[variable: string]: string}})._env_ || {}

const envServer = env.SERVER_URL || 'http://localhost:3005'
export const serverUrl = (!envServer || envServer === '/') ?
    `${window.location.protocol}//${window.location.host}` :
    envServer
export const fakeSiteId = 'testSite'
export const fakeJWTToken = env.FAKE_JWT_TOKEN ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJmaXJzdE5hbWUiOiJKb2huIiwibGFzdE5hbWUiOiJEb2UifQ.J7fWaQlPyhEbyRYAJCNcp9fq_1O-pUN1ujbDTrbOsKc'
export const maxLogsEntries = env.MAX_LOGS_ENTRIES ?
    Number(env.MAX_LOGS_ENTRIES) :
    50

export const useCheckJointsStepper = env.CHECK_JOINTS_CONTROL === 'stepper'

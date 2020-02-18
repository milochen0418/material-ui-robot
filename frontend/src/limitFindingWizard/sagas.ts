import {
    all,
    call,
    take,
    takeLatest,
    put,
    race,
} from 'redux-saga/effects'
import {httpPost, getResponseBody} from 'utils'
import {ActionWithRobot} from 'types'
import {runLimitFindingError, runLimitFindingSuccess} from './actions'
import * as constants from './constants'

function* runLimitFinding(action: ActionWithRobot) {
    const {robot} = action
    const response: Response = yield httpPost(`robot/${robot.id}/runLimitFinding`)
    const {status} = response
    const responseBody = yield getResponseBody(response)
    if (status >= 400) {
        yield put(runLimitFindingError(responseBody && responseBody.error ? responseBody.error : undefined))
    } else {
        yield put(runLimitFindingSuccess())
    }
}

function* runLimitFindingSaga() {
    yield takeLatest<ActionWithRobot>(constants.RUN_LIMIT_FINDING, function *(action) {
        yield race({
            cancel: take(constants.CANCEL_LIMIT_FINDING),
            task: call(runLimitFinding, action),
        })
    })
}

function* cancelLimitFindingSage() {
    yield takeLatest<ActionWithRobot>(constants.CANCEL_LIMIT_FINDING, function *(action) {
        yield httpPost(`robot/${action.robot.id}/cancelLimitFinding`)
    })
}

function* limitFindingWizardSagas() {
    yield all([
        runLimitFindingSaga(),
        cancelLimitFindingSage(),
    ])
}

export default limitFindingWizardSagas

import {all, put, takeEvery} from 'redux-saga/effects'
import {httpPost} from 'utils'
import {addSnackbarMessage} from 'app'
import {finishManualControl} from './robotActions'
import * as constants from './constants'
import {MoveJointAction, SetManualControlAction} from './types'

function* setManualControlSage() {
    yield takeEvery<SetManualControlAction>(constants.SET_MANUAL_CONTROL, function *(action) {
        const {robot, enable} = action
        const {status} = yield httpPost(`robot/${robot.id}/setManualControl`, {
            enable,
        })

        yield put(finishManualControl(robot))
        if (status >= 400) {
            yield put(addSnackbarMessage('Couldn\'t enable manual control. Please check robot status.', 'error'))
        } else {
            yield put(addSnackbarMessage('Manual control enabled!', 'success'))
        }
    })
}

function* moveJointSaga() {
    yield takeEvery<MoveJointAction>(constants.MOVE_JOINT, (action) => {
        const {robot, joint, isPositiveDirection} = action
        httpPost(`robot/${robot.id}/moveJoint`, {
            isPositiveDirection,
            joint,
        })
    })
}

function* sharedActionsSagas() {
    yield all([
        moveJointSaga(),
        setManualControlSage(),
    ])
}

export default sharedActionsSagas

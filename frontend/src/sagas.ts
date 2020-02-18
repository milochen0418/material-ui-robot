import {all} from 'redux-saga/effects'
import {sagas as actions} from './robotOperations'
import {sagas as limitFindingWizard} from './limitFindingWizard'

function* rootSaga() {
    yield all([
        limitFindingWizard(),
        actions(),
    ])
}

export default rootSaga

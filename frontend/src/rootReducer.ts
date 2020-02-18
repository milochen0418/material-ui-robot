import {applyMiddleware, combineReducers, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import {reducer as auth} from './auth'
import {reducer as robotOperations} from './robotOperations'
import {reducer as app} from './app'
import rootSaga from './sagas'
import {reducer as limitFindingWizard} from './limitFindingWizard'

const reducers = {
    app,
    auth,
    limitFindingWizard,
    robotOperations,
}

/*
TODO: uncomment this block section when
 https://github.com/abettadapur/redux-saga-devtools-extension/issues/6 is resolved
const monitor = (window as {__SAGA_MONITOR_EXTENSION__?: object}).__SAGA_MONITOR_EXTENSION__
const sagaMiddleware = createSagaMiddleware({sagaMonitor: monitor})
*/

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
    combineReducers(reducers),
    /* preloadedState, */
    composeWithDevTools(
        applyMiddleware(thunk, sagaMiddleware)
    )
)

sagaMiddleware.run(rootSaga)

export default store

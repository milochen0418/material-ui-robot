import {connect} from 'react-redux'
import {AnyAction} from 'redux'
import {ThunkDispatch} from 'redux-thunk'
import {Store} from 'types'
import App from './App'
import {fetchRobots} from './actions'
import {initEventListener} from '../events'

const mapStateToProps = (state: Store) => ({
    isDrawerOpen: state.app.isDrawerOpen,
    pageOptions: state.app.pageOptions,
})

const mapDispatchToProps = (dispatch: ThunkDispatch<Store, undefined, AnyAction>) => ({
    initApp: () => {
        dispatch(fetchRobots())
        initEventListener(dispatch)
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(App)

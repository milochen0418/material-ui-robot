import {connect} from 'react-redux'
import {toggleDrawer} from './actions'
import AppToolbar from './AppToolbar'
import {getSelectedRobot} from './selectors'
import {Store} from '../types'

const mapStateToProps = (state: Store) => ({
    selectedRobot: getSelectedRobot(state),
})

export default connect(mapStateToProps, {toggleDrawer})(AppToolbar)

import {connect} from 'react-redux'
import {Store} from 'types'
import {toggleDrawer, setSelectedRobot} from './actions'
import {getSelectedRobot} from './selectors'
import AppDrawer from './AppDrawer'

const mapStateToProps = (state: Store) => ({
    isDrawerOpen: state.app.isDrawerOpen,
    robots: state.app.robots,
    selectedRobot: getSelectedRobot(state),
})

export default connect(mapStateToProps, {toggleDrawer, setSelectedRobot})(AppDrawer)

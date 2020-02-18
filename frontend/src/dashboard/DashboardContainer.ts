import {connect} from 'react-redux'
import {Store} from 'types'
import {getSelectedRobot} from 'app'
import Dashboard from './Dashboard'

const mapStateToProps = (state: Store) => ({
    robot: getSelectedRobot(state),
})

export default connect(mapStateToProps)(Dashboard)

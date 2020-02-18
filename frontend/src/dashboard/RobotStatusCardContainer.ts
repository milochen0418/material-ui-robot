import React from 'react'
import {connect} from 'react-redux'
import {setManualControl} from 'robotOperations'
import {Store} from 'types'
import {DashboardProps} from './types'
import RobotStatusCard from './RobotStatusCard'

const mapStateToProps = (state: Store, ownProps: DashboardProps) => ({
    isChangingManualMode: ownProps.robot ?
        state.robotOperations.runningManualControlOperations[ownProps.robot.id] :
        false,
})

const mapDispatchToProps = {
    setManualControl,
}

export default connect(mapStateToProps, mapDispatchToProps)(RobotStatusCard) as React.ComponentType<DashboardProps>

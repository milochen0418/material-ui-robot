import React from 'react'
import {connect} from 'react-redux'
import {History} from 'history'
import {Store} from 'types'
import {ROUTES} from '../constants'
import {getActions} from './selectors'
import {DashboardProps} from './types'
import RobotActionsCard from './RobotActionsCard'

const mapStateToProps = (state: Store) => ({
    actions: getActions(state),
})

const mapDispatchToProps = () => ({
    availableActions: {
        startLimitFinding: (history: History) => {
            history.push(ROUTES.LIMIT_FINDING_WIZARD)
        },
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(RobotActionsCard) as React.ComponentType<DashboardProps>

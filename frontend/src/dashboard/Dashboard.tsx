import React from 'react'
import Grid from '@material-ui/core/Grid'
import RobotStatusCardContainer from './RobotStatusCardContainer'
import RobotActionsCardContainer from './RobotActionsCardContainer'
import {DashboardProps} from './types'

const Dashboard = ({robot}: DashboardProps) => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4} xl={3}>
                <RobotStatusCardContainer robot={robot} />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={3}>
                <RobotActionsCardContainer robot={robot} />
            </Grid>
        </Grid>
    )
}

export default Dashboard

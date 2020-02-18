import {AppContainer, withPageOptionsHOC} from 'app'
import {DashboardContainer} from 'dashboard'
import {PageNotFound} from 'notFound'
import {Tools} from 'tools'
import {LimitFindingWizard} from 'limitFindingWizard'
import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom'
import {ROUTES} from '../constants'

const Routes = () => (
    <Router>
        <AppContainer>
            <Switch>
                <Route
                    component={withPageOptionsHOC({})(DashboardContainer)}
                    exact
                    path={ROUTES.HOME}
                />
                <Route
                    component={withPageOptionsHOC({})(Tools)}
                    path={ROUTES.TOOLS}
                />
                <Route
                    component={withPageOptionsHOC({rawPage: true, title: 'Limit Finding Wizard'})(LimitFindingWizard)}
                    path={ROUTES.LIMIT_FINDING_WIZARD}
                />
                <Route
                    component={withPageOptionsHOC({rawPage: true})(PageNotFound)}
                    path="*"
                />
            </Switch>
        </AppContainer>
    </Router>
)

export default Routes

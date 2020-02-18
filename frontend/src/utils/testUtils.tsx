import React from 'react'
import {render} from '@testing-library/react'
import {createMemoryHistory, History} from 'history'
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store'
import {Router} from 'react-router-dom'

const mockRobot = {
    files: {
        cube: 'testFile',
        joints: {
            left: 'testFile',
            right: 'testFile',
        },
    },
    healthStatus: {
        limitFindingStatus: 'ok',
    },
    id: 'testId',
    joints: ['left', 'right'],
    lastKeepAliveReceivedAt: new Date(),
    name: 'Rico',
}

export function renderWithRouter(
    ui: React.ReactElement,
    {
        storeState,
        route,
        history,
    }: {storeState?: object, route?: string, history?: History} = {}
) {
    const initialStoreState = storeState || {
        app: {
            robots: [mockRobot],
            selectedRobot: mockRobot,
        },
        limitFindingWizard: {
            currentStep: 'CHECK_POSITION',
        },
        robotOperations: {
            runningManualControlOperations: {},
        },
    }
    const mockStore = configureStore([])

    class Wrapper extends React.Component {
        render() {
            const store = mockStore(initialStoreState)
            return (
                <Provider store={store}>
                    <Router history={history || createMemoryHistory({ initialEntries: [route || '/'] })}>
                        {this.props.children}
                    </Router>
                </Provider>
            )
        }
    }

    return render(ui, { wrapper: Wrapper })
}

import React from 'react'
import {Provider} from 'react-redux'
import {Store} from 'redux'
import Routes from './routes'

const Root = ({store}: {store: Store}) => (
    <Provider store={store}>
        <Routes />
    </Provider>
)

export default Root

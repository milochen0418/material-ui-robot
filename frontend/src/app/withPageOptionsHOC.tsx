import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {setPageOptions} from './actions'

const withPageOptionsHOC = (pageOptions: {}) => (WrappedComponent: React.ComponentType) => {
    // tslint:disable-next-line:no-shadowed-variable
    const HOC = ({setPageOptions, ...props}: {setPageOptions: (options: {}) => void}) => {
        useEffect(() => {
            setPageOptions(pageOptions)
        }, [pageOptions])

        return <WrappedComponent {...props} />
    }

    return connect(null, {setPageOptions})(HOC)
}

export default withPageOptionsHOC

import {connect} from 'react-redux'
import {removeSnackbarMessage} from './actions'
import Snackbar from './Snackbar'
import {Store} from '../types'

const mapStateToProps = (state: Store) => {
    const currentMessage = state.app.messages.length > 0 ?
        state.app.messages[0] :
        null

    return {
        message: currentMessage?.message,
        type: currentMessage?.type,
    }
}

export default connect(mapStateToProps, {removeSnackbarMessage})(Snackbar)

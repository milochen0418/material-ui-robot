import React from 'react'
import {useTranslation} from 'react-i18next'
import MaterialSnackbar from '@material-ui/core/Snackbar'
import {SnackbarProps} from './types'

const Snackbar = ({
    message,
    removeSnackbarMessage,
}: SnackbarProps) => {
    const {t} = useTranslation()

    if (!message) {
        return null
    }

    return (
        <MaterialSnackbar
            autoHideDuration={3000}
            onClose={removeSnackbarMessage}
            open
            message={t(message)}
        />
    )
}

export default Snackbar

import React, {useEffect} from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import {makeStyles, ThemeProvider} from '@material-ui/core/styles'
import AppDrawerContainer from './AppDrawerContainer'
import AppToolbarContainer from './AppToolbarContainer'
import SnackbarContainer from './SnackbarContainer'
import * as Styled from './AppStyled'
import appTheme from './appTheme'
import {AppProps} from './types'

const useStyles = makeStyles(theme => ({
    contentSmall: {
        [theme.breakpoints.down('xs')]: {
            marginLeft: 0,
        },
    },
    toolbar: theme.mixins.toolbar,
}))

const App = ({
     children,
     initApp,
     isDrawerOpen,
     pageOptions,
 }: AppProps) => {
    const classes = useStyles()
    useEffect(() => {
        initApp()
    }, [])

    return (
        <Styled.App>
            <ThemeProvider theme={appTheme}>
                <CssBaseline />
                <AppToolbarContainer pageOptions={pageOptions} />
                <AppDrawerContainer pageOptions={pageOptions} />
                <Styled.Content
                    isDrawerOpen={isDrawerOpen || Boolean(pageOptions.rawPage)}
                    className={classes.contentSmall}
                >
                    <div className={classes.toolbar} />
                    {children}
                </Styled.Content>
                <SnackbarContainer />
            </ThemeProvider>
        </Styled.App>
    )
}

export default App

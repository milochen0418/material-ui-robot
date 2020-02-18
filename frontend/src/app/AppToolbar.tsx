import React from 'react'
import {useTranslation} from 'react-i18next'
import {makeStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import NotificationsIcon from '@material-ui/icons/Notifications'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import BuildIcon from '@material-ui/icons/Build'
import HomeIcon from '@material-ui/icons/Home'
import {useHistory, useLocation} from 'react-router-dom'
import * as Styled from './AppStyled'
import {AppToolbarProps} from './types'
import {ROUTES} from '../constants'

const useStyles = makeStyles(theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
}))

const AppToolbar = ({pageOptions, selectedRobot, toggleDrawer}: AppToolbarProps) => {
    const {t} = useTranslation()
    const classes = useStyles()
    const history = useHistory()
    const location = useLocation()
    const goToPageCreator = (route: string) => () => {
        if (!location || location.pathname !== route) {
            history.push(route)
        } else {
            history.replace(route)
        }
    }

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                {pageOptions.rawPage ? (
                    <>
                        {pageOptions.title && (
                            <Styled.ToolbarTitle>
                                {t(pageOptions.title)}
                            </Styled.ToolbarTitle>
                        )}
                    </>
                ) : (
                    <>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Styled.ToolbarTitle>
                            {t('Robot')}: {selectedRobot?.name}
                        </Styled.ToolbarTitle>
                        <HomeIcon  color="inherit" onClick={goToPageCreator(ROUTES.HOME)}>
                            <BuildIcon />
                        </HomeIcon>
                        <IconButton color="inherit">
                            <Badge badgeContent={17} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton  color="inherit" onClick={goToPageCreator(ROUTES.TOOLS)}>
                            <BuildIcon />
                        </IconButton>
                        <IconButton  color="inherit">
                            <AccountCircle />
                        </IconButton>
                    </>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default AppToolbar

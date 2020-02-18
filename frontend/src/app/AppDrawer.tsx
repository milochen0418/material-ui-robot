import React from 'react'
import {useTranslation} from 'react-i18next'
import {makeStyles} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import * as Styled from './AppStyled'
import {DRAWER_WIDTH} from './constants'
import {AppDrawerProps} from './types'

const useStyles = makeStyles(theme => ({
    drawer: {
        [theme.breakpoints.up('sm')]: {
            flexShrink: 0,
            width: DRAWER_WIDTH,
        },
    },
    drawerPaper: {
        width: DRAWER_WIDTH,
    },
    toolbar: theme.mixins.toolbar,
}))

const AppDrawer = ({
    isDrawerOpen,
    pageOptions,
    toggleDrawer,
    robots,
    selectedRobot,
    setSelectedRobot,
}: AppDrawerProps) => {
    const {t} = useTranslation()
    const classes = useStyles()

    if (pageOptions.rawPage) {
        return null
    }

    const drawer = (
        <div>
            <div className={classes.toolbar} />
            <Divider />
            <Styled.DrawerSectionTitle>
                {t('Robots')}:
            </Styled.DrawerSectionTitle>
            <List>
                {robots.map(robot => (
                    <ListItem
                        button
                        key={robot.id}
                        selected={robot.id === selectedRobot?.id}
                        onClick={() => setSelectedRobot(robot)}
                    >
                        <Styled.Badge robot={robot} color="error" variant="dot">
                            <ListItemText primary={robot.name} />
                        </Styled.Badge>
                    </ListItem>
                ))}
            </List>
            <Divider />
        </div>
    )

    const commonDrawerProps = {
        classes: {
            paper: classes.drawerPaper,
        },
    }

    return (
        <nav className={classes.drawer}>
            <Hidden smUp>
                <Drawer
                    {...commonDrawerProps}
                    variant="temporary"
                    anchor="left"
                    open={isDrawerOpen}
                    onClose={toggleDrawer}
                    ModalProps={{keepMounted: true}}
                >
                    {drawer}
                </Drawer>
            </Hidden>
            <Hidden xsDown>
                <Drawer
                    {...commonDrawerProps}
                    variant="persistent"
                    open={isDrawerOpen}
                >
                    {drawer}
                </Drawer>
            </Hidden>
        </nav>
    )
}

export default AppDrawer

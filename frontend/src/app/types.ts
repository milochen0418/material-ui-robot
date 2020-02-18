import React from 'react'
import {Robot} from 'types'

interface PageOptionsProps {
    pageOptions: {
        rawPage?: boolean;
        title?: string;
    },
}

export interface AppProps extends PageOptionsProps {
    children?: React.ReactNode,
    isDrawerOpen: boolean,
    initApp: () => void,
}

export interface AppDrawerProps extends PageOptionsProps {
    isDrawerOpen: boolean
    toggleDrawer: () => void
    robots: Robot[]
    selectedRobot: Robot | null
    setSelectedRobot: (robot: Robot) => void
}

export interface AppToolbarProps extends PageOptionsProps {
    toggleDrawer: () => void,
    selectedRobot: Robot | null
}

export interface SnackbarProps {
    message?: string,
    removeSnackbarMessage: () => void,
}

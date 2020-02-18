import {createMuiTheme} from '@material-ui/core/styles'
import {primary, secondary} from '../colors'

export default createMuiTheme({
    palette: {
        primary: {
            main: primary,
        },
        secondary: {
            main: secondary,
        },
    },
})

import styled from 'styled-components'
import TableContainer from '@material-ui/core/TableContainer'

export const TableWrapper = styled(TableContainer)`
    td,
    th {
        width: 50%;
    }

    .MuiExpansionPanel-root {
        box-shadow: none;

        .MuiCollapse-container {
            margin-top: -12px;
        }
    }

    .MuiExpansionPanelDetails-root,
    .MuiExpansionPanelSummary-root {
        padding: 0;
    }

    .MuiExpansionPanelSummary-content.Mui-expanded {
        margin: 0;
    }
`

export const LoaderWrapper = styled.div`
    display: flex;
    margin: 16px;
    justify-content: center;
    align-items: center;
`

export const ActionsWrapper = styled.div`
    margin: 0;
`

export const NoActions = styled.div`
    margin-top: 16px;
    font-size: 1rem;
`

export const Offline = styled.div`
    display: flex;
    align-items: center;
`

export const OfflineMessage = styled.div`
    margin-left: 16px;
    font-size: 1rem;
`

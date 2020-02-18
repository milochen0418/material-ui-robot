import React from 'react'
import {useTranslation} from 'react-i18next'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
import PlayArrayIcon from '@material-ui/icons/PlayArrow'
import Fab from '@material-ui/core/Fab'
import {CardActionProps} from './types'

export const ActionWrapper = styled.div`
    margin: 8px 0;
    padding: 0 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #868686;

    &:last-child {
        border-bottom: none;
    }
`

const Text = styled.div`
    text-transform: uppercase;
    font-weight: 500;
`

const StyledFab = styled(Fab)`
    box-shadow: none;
`

const CardAction = ({action, availableActions}: CardActionProps) => {
    const {t} = useTranslation()
    const history = useHistory()
    const onClick = action.actionKey && availableActions[action.actionKey] ?
        () => availableActions[action.actionKey as string](history) :
        undefined
    return (
        <ActionWrapper title={action.disabledReason}>
            <Text>
                 {t(action.localeKey)}
            </Text>
            <StyledFab
                color={action.main ? 'primary' : 'default'}
                disabled={!Boolean(action.actionKey) || Boolean(action.disabledReason)}
                size="small"
                onClick={onClick}
            >
                <PlayArrayIcon />
            </StyledFab>
        </ActionWrapper>
    )
}

export default CardAction

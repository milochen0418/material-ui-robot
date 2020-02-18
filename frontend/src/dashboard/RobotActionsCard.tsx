import React from 'react'
import {CardContent} from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import WifiOffIcon from '@material-ui/icons/WifiOff'
import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'
import {isRobotOnline} from 'utils'
import {CardTitle, Button, CardAction} from 'components'
import * as Styled from './DashboardStyled'
import {RobotActionsCardProps} from './types'
import {ROUTES} from '../constants'

const RobotStatusCard = ({robot, actions, availableActions}: RobotActionsCardProps) => {
    const {t} = useTranslation()
    const {push} = useHistory()
    const actionItems = actions.length > 0 ?
        actions.map(action => (
            <CardAction action={action} availableActions={availableActions} key={action.localeKey} />
        )) : (
        <Styled.NoActions>
            {t('No actions to perform')}
        </Styled.NoActions>
    )

    return robot ? (
        <Card>
            <CardContent>
                <CardTitle>{t('Actions')}</CardTitle>
                {isRobotOnline(robot) ? (
                    <Styled.ActionsWrapper>
                        {actionItems}
                    </Styled.ActionsWrapper>
                ) : (
                    <Styled.Offline>
                        <WifiOffIcon color="disabled" fontSize="large" />
                        <Styled.OfflineMessage>
                            {t('Robot is offline, cannot perform any actions')}
                        </Styled.OfflineMessage>
                    </Styled.Offline>
                )}
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => push(ROUTES.TOOLS)}>
                    {t('View all tools')}
                </Button>
            </CardActions>
        </Card>
    ) : null
}

export default RobotStatusCard

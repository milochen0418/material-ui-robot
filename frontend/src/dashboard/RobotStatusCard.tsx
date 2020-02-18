import React, {useCallback} from 'react'
import {CardContent} from '@material-ui/core'
import moment from 'moment'
import Card from '@material-ui/core/Card'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import CircularProgress from '@material-ui/core/CircularProgress'
import Switch from '@material-ui/core/Switch'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {useTranslation} from 'react-i18next'
import {getStatusLocalizationKey} from 'utils'
import {CardContentFullWidth, CardTitle} from 'components'
import {LoaderWrapper, TableWrapper} from './DashboardStyled'
import {RobotStatusCardProps} from './types'
import {SimpleStatus} from '../types'

const RobotStatusCard = ({
    isChangingManualMode,
    robot,
    setManualControl,
}: RobotStatusCardProps) => {
    const {t} = useTranslation()
    const changeManualControl = useCallback(() => {
        if (robot) {
            setManualControl(robot, robot.healthStatus.manualControl !== SimpleStatus.YES)
        }
    }, [robot, setManualControl])

    const manualModeChangeInProgress = (
        isChangingManualMode ||
        robot?.healthStatus.manualControl === SimpleStatus.IN_PROGRESS
    )

    return (
        <Card>
            <CardContent>
                <CardTitle>{t('Robot status')}</CardTitle>
                <CardContentFullWidth>
                    {robot ? (
                        <TableWrapper>
                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell variant="head" align="right">{t('Name')}</TableCell>
                                        <TableCell>{robot?.name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" align="right">{t('Last update at')}</TableCell>
                                        <TableCell>
                                            {robot?.lastKeepAliveReceivedAt ?
                                                moment(robot.lastKeepAliveReceivedAt).format('LLL') :
                                                null}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" align="right">{t('Joints')}</TableCell>
                                        <TableCell>
                                            {robot?.joints.length > 0 ? (
                                                <ExpansionPanel>
                                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                        {robot?.joints.slice(0, 2).join(', ')},
                                                    </ExpansionPanelSummary>
                                                    <ExpansionPanelDetails>
                                                        {robot?.joints.slice(2).join(', ')}
                                                    </ExpansionPanelDetails>
                                                </ExpansionPanel>
                                            ) : '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" align="right">{t('Power on self test')}</TableCell>
                                        <TableCell data-testid="statusCardPowerOnValue">
                                            {t(getStatusLocalizationKey(robot?.healthStatus.powerOnSelfTestStatus))}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" align="right">{t('Limit finding status')}</TableCell>
                                        <TableCell data-testid="statusCardLimitFindingValue">
                                            {robot?.healthStatus.limitFindingStatus ?
                                                t(getStatusLocalizationKey(robot?.healthStatus.limitFindingStatus)) :
                                                '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" align="right">{t('Manual control')}</TableCell>
                                        <TableCell>
                                            {manualModeChangeInProgress ? (
                                                <CircularProgress size={20} />
                                            ) : (
                                                <Switch
                                                    checked={robot?.healthStatus.manualControl === SimpleStatus.YES}
                                                    onChange={changeManualControl}
                                                    color="primary"
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableWrapper>
                    ) : (
                        <LoaderWrapper>
                            <CircularProgress />
                        </LoaderWrapper>
                    )}
                </CardContentFullWidth>
            </CardContent>
        </Card>
    )
}

export default RobotStatusCard

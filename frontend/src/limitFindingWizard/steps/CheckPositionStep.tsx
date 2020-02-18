import React from 'react'
import {useTranslation} from 'react-i18next'
import {serverUrl} from 'config'
import * as Styled from './StepsStyled'
import {StepProps} from './types'

const CheckPositionStep: React.FC<StepProps> = ({selectedRobot}) => {
    const {t} = useTranslation()
    return (
        <Styled.Step>
            <Styled.StepQuestion>
                {t('Please check if the robot is in rest pose')}
            </Styled.StepQuestion>
            <Styled.StepHelpText>
                {t('Make sure that the robot has 2m of free space in each direction')}
            </Styled.StepHelpText>
            <Styled.StepImage src={serverUrl + selectedRobot.files.cube} />
        </Styled.Step>
    )
}

export default CheckPositionStep

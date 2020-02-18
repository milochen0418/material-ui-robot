import React from 'react'
import {useTranslation} from 'react-i18next'
import * as Styled from './StepsStyled'
import {StepProps} from './types'

const DoneStep: React.FC<StepProps> = () => {
    const {t} = useTranslation()
    return (
        <Styled.Step>
            <Styled.StepQuestion>
                {t('Limit Finding Finished!')}
            </Styled.StepQuestion>
            <Styled.StepHelpText>
                {t('Limit finding procedure finished successfully.')}
            </Styled.StepHelpText>
            <Styled.StepContent>
                <Styled.SuccessIcon />
            </Styled.StepContent>
        </Styled.Step>
    )
}

export default DoneStep

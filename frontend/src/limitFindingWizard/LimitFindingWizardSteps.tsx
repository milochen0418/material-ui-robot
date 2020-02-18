import React from 'react'
import {useTranslation} from 'react-i18next'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import * as constants from './constants'
import {LimitFindingWizardStepsProps} from './types'
import * as Styled from './LimitFindingWizardStyled'

const LimitFindingWizardSteps = ({activeStepIndex}: LimitFindingWizardStepsProps) => {
    const {t} = useTranslation()
    return (
        <Styled.LimitFindingWizardSteps>
            <Stepper activeStep={activeStepIndex} alternativeLabel>
                {constants.ORDERED_STEPS.map(step => (
                    <Step key={step}>
                        <StepLabel>{t(constants.STEP_TO_TRANSLATION_KEY[step])}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Styled.LimitFindingWizardSteps>
    )
}

export default LimitFindingWizardSteps

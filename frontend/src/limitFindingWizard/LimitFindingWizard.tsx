import React from 'react'
import * as Styled from './LimitFindingWizardStyled'
import LimitFindingWizardStepsContainer from './LimitFindingWizardStepsContainer'
import {StepContentContainer} from './steps'
import LimitFindingWizardFooterContainer from './LimitFindingWizardFooterContainer'

const LimitFindingWizard = () => {
    return (
        <Styled.LimitFindingWizard>
            <LimitFindingWizardStepsContainer />
            <Styled.LimitFindingWizardContent>
                <StepContentContainer />
            </Styled.LimitFindingWizardContent>
            <LimitFindingWizardFooterContainer />
        </Styled.LimitFindingWizard>
    )
}

export default LimitFindingWizard

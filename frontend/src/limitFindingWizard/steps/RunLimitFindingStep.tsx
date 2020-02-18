import React, {useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import CircularProgress from '@material-ui/core/CircularProgress'
import * as Styled from './StepsStyled'
import {StepProps} from './types'

const RunLimitFindingStep: React.FC<StepProps> = ({
    disableNextStep,
    goToNextStep,
    runLimitFinding,
    isRunningLimitFinding,
    limitFindingError,
    limitFindingSuccessful,
}) => {
    const {t} = useTranslation()
    useEffect(() => {
        disableNextStep()
        runLimitFinding()
    }, [])
    useEffect(() => {
        if (limitFindingSuccessful) {
            goToNextStep()
        }
    }, [limitFindingSuccessful])
    return (
        <Styled.Step>
            <Styled.StepQuestion hasError={Boolean(limitFindingError)}>
                {limitFindingError ?
                    t('Limit finding finished with errors!') :
                    t('Running limit finding')
                }
            </Styled.StepQuestion>
            {limitFindingError ? (
                <Styled.StepHelpText isError>
                    {limitFindingError}
                </Styled.StepHelpText>
            ) : (
                <Styled.StepHelpText>
                    {t('Please wait while running limit finding is in progress...')}
                </Styled.StepHelpText>
            )}
            <Styled.StepContent isProgressWrapper={isRunningLimitFinding}>
                {isRunningLimitFinding && <CircularProgress />}
            </Styled.StepContent>
        </Styled.Step>
    )
}

export default RunLimitFindingStep

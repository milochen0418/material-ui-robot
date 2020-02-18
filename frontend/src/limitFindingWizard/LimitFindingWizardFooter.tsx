import React, {useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import CloseIcon from '@material-ui/icons/Close'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import HomeIcon from '@material-ui/icons/Home'
import {Button} from 'components'
import {LimitFindingWizardFooterProps} from './types'
import * as Styled from './LimitFindingWizardStyled'

const LimitFindingWizardFooter = ({
    canGoPrevious,
    canGoNext,
    cancel,
    clear,
    goToNextStep,
    goToPreviousStep,
    isDone,
}: LimitFindingWizardFooterProps) => {
    const {goBack} = useHistory()
    useEffect(() => {
        return function clean() {
            clear()
        }
    }, [])

    return (
        <Styled.LimitFindingWizardFooter isDone={isDone}>
            {isDone ? (
                <Button
                    color="primary"
                    onClick={goBack}
                    variant="contained"
                    data-testid="limitFindingDashboardAction"
                >
                    <HomeIcon />
                </Button>
            ) : (
                <>
                    <Button
                        color="default"
                        onClick={() => cancel(goBack)}
                        variant="contained"
                        data-testid="limitFindingCancelAction"
                    >
                        <CloseIcon />
                    </Button>

                    <Styled.MainButtons>
                        {canGoPrevious && (
                            <Button
                                onClick={goToPreviousStep}
                                data-testid="limitFindingPreviousAction"
                            >
                                <NavigateBeforeIcon />
                            </Button>
                        )}
                        <Button
                            color="primary"
                            disabled={!canGoNext}
                            onClick={goToNextStep}
                            variant="contained"
                            data-testid="limitFindingNextAction"
                        >
                            <NavigateNextIcon />
                        </Button>
                    </Styled.MainButtons>
                </>
            )}
        </Styled.LimitFindingWizardFooter>
    )
}

export default LimitFindingWizardFooter

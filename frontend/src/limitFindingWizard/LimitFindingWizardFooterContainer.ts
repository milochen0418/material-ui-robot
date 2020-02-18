import {AnyAction, compose} from 'redux'
import {connect} from 'react-redux'
import {Store} from 'types'
import {
    goToNextStep,
    goToPreviousStep,
    cancelLimitFinding,
    clear,
} from './actions'
import {ORDERED_STEPS} from './constants'
import {
    LimitFindingWizardFooterStateProps,
    LimitFindingWizardFooterDispatchProps,
    LimitFindingWizardFooterProps,
} from './types'
import LimitFindingWizardFooter from './LimitFindingWizardFooter'
import {ThunkDispatch} from 'redux-thunk'

const mapStateToProps = (state: Store): LimitFindingWizardFooterStateProps => {
    const {currentStep, isNextStepEnabled, limitFindingError} = state.limitFindingWizard
    const isDone = currentStep === ORDERED_STEPS[ORDERED_STEPS.length - 1] || Boolean(limitFindingError)
    const currentStepIndex = ORDERED_STEPS.indexOf(currentStep)
    return {
        canGoNext: isNextStepEnabled && !isDone && currentStepIndex < (ORDERED_STEPS.length - 1),
        canGoPrevious: false, // for now we don't allow such action from UI
        isDone,
        selectedRobot: state.app.selectedRobot,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>): LimitFindingWizardFooterDispatchProps => ({
    cancelLimitFinding: compose(dispatch, cancelLimitFinding),
    clear: compose(dispatch, clear),
    goToNextStep: compose(dispatch, goToNextStep),
    goToPreviousStep: compose(dispatch, goToPreviousStep),
})

const mergeProps = (
    stateProps: LimitFindingWizardFooterStateProps,
    dispatchProps: LimitFindingWizardFooterDispatchProps
): LimitFindingWizardFooterProps => ({
    ...stateProps,
    ...dispatchProps,
    cancel: (goBack: () => void) => {
        if (stateProps.selectedRobot) {
            dispatchProps.cancelLimitFinding(stateProps.selectedRobot)
        }

        goBack()
    },
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(LimitFindingWizardFooter)

import {Robot} from 'types'

export interface LimitFindingWizardStepsProps {
    activeStepIndex: number,
}

export interface LimitFindingWizardFooterStateProps {
    canGoNext: boolean,
    canGoPrevious: boolean,
    isDone: boolean,
    selectedRobot: Robot | null,
}

export interface LimitFindingWizardFooterDispatchProps {
    cancelLimitFinding: (selectedRobot: Robot) => void,
    clear: () => void,
    goToNextStep: () => void,
    goToPreviousStep: () => void,
}

export interface LimitFindingWizardFooterProps extends
    LimitFindingWizardFooterStateProps,
    LimitFindingWizardFooterDispatchProps {
    cancel: (goBack: () => void) => void,
}

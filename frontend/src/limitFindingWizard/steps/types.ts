import {Robot} from 'types'

export interface StepProps {
    disableNextStep: () => void,
    enableNextStep: () => void,
    goToNextStep: () => void,
    runLimitFinding: () => void,
    isRunningLimitFinding: boolean,
    limitFindingError: string | null,
    limitFindingSuccessful: boolean,
    selectedRobot: Robot,
}

export interface StepContentStateProps {
    currentStep: string,
    isRunningLimitFinding: boolean,
    limitFindingError: string | null,
    limitFindingSuccessful: boolean,
    selectedRobot: Robot | null,
}

export interface StepContentProps extends StepContentStateProps {
    disableNextStep: () => void,
    enableNextStep: () => void,
    goToNextStep: () => void,
    runLimitFinding: (robot: Robot) => void,
}

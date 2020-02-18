import React from 'react'
import {useCheckJointsStepper} from 'config'
import {STEPS} from '../constants'
import CheckJointsStepStepper from './CheckJointsStepStepper'
import CheckJointsStepSlider from './CheckJointsStepSlider'
import CheckPositionStep from './CheckPositionStep'
import RunLimitFindingStep from './RunLimitFindingStep'
import DoneStep from './DoneStep'
import {StepContentProps, StepProps} from './types'

const getComponentToDisplay = (currentStep: string): React.ComponentType<StepProps> | undefined => {
    switch (currentStep) {
        case STEPS.CHECK_POSITION:
           return CheckPositionStep
        case STEPS.CHECK_JOINTS:
           return useCheckJointsStepper ? CheckJointsStepStepper : CheckJointsStepSlider
        case STEPS.START_LIMIT_FINDING_ROUTINE:
           return RunLimitFindingStep
        case STEPS.DONE:
           return DoneStep
        default:
            return undefined
    }
}

const StepContent: React.FC<StepContentProps> = ({
    currentStep,
    disableNextStep,
    enableNextStep,
    goToNextStep,
    isRunningLimitFinding,
    limitFindingError,
    limitFindingSuccessful,
    runLimitFinding,
    selectedRobot,
}: StepContentProps) => {
    if (selectedRobot === null) {
        return null
    }

    const ComponentToShow = getComponentToDisplay(currentStep)
    if (!ComponentToShow) {
        return null
    }

    return (
        <ComponentToShow
            disableNextStep={disableNextStep}
            enableNextStep={enableNextStep}
            goToNextStep={goToNextStep}
            limitFindingError={limitFindingError}
            isRunningLimitFinding={isRunningLimitFinding}
            limitFindingSuccessful={limitFindingSuccessful}
            runLimitFinding={() => runLimitFinding(selectedRobot)}
            selectedRobot={selectedRobot}
        />
    )
}

export default StepContent

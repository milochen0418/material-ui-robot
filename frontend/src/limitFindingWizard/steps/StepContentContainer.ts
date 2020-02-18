import {connect} from 'react-redux'
import {Store} from 'types'
import {
    disableNextStep,
    enableNextStep,
    goToNextStep,
    runLimitFinding,
} from '../actions'
import {StepContentStateProps} from './types'
import StepContent from './StepContent'

const mapStateToProps = (state: Store): StepContentStateProps => ({
    currentStep: state.limitFindingWizard.currentStep,
    isRunningLimitFinding: state.limitFindingWizard.isRunningLimitFinding,
    limitFindingError: state.limitFindingWizard.limitFindingError,
    limitFindingSuccessful: state.limitFindingWizard.limitFindingSuccessful,
    selectedRobot: state.app.selectedRobot,
})

const mapDispatchToProps = {
    disableNextStep,
    enableNextStep,
    goToNextStep,
    runLimitFinding,
}

export default connect(mapStateToProps, mapDispatchToProps)(StepContent)

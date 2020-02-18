import {connect} from 'react-redux'
import {Store} from 'types'
import {ORDERED_STEPS} from './constants'
import {LimitFindingWizardStepsProps} from './types'
import LimitFindingWizardSteps from './LimitFindingWizardSteps'

const mapStateToProps = (state: Store): LimitFindingWizardStepsProps => {
    const {currentStep} = state.limitFindingWizard
    const activeStepIndex = ORDERED_STEPS.indexOf(currentStep)
    return {
        activeStepIndex,
    }
}

export default connect(mapStateToProps)(LimitFindingWizardSteps)

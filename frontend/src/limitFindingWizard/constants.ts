export const STEPS = {
    CHECK_JOINTS: 'CHECK_JOINTS',
    CHECK_POSITION: 'CHECK_POSITION',
    DONE: 'DONE',
    START_LIMIT_FINDING_ROUTINE: 'START_LIMIT_FINDING_ROUTINE',
}

export const STEP_TO_TRANSLATION_KEY = {
    [STEPS.CHECK_JOINTS]: 'Check joints',
    [STEPS.CHECK_POSITION]: 'Check robot position',
    [STEPS.DONE]: 'Done',
    [STEPS.START_LIMIT_FINDING_ROUTINE]: 'Run limit finding',
}

export const ORDERED_STEPS = [
    STEPS.CHECK_POSITION,
    STEPS.CHECK_JOINTS,
    STEPS.START_LIMIT_FINDING_ROUTINE,
    STEPS.DONE,
]

const ACTION_PREFIX = 'limitFindingWizard/'

export const NEXT_STEP = `${ACTION_PREFIX}NEXT_STEP`
export const PREVIOUS_STEP = `${ACTION_PREFIX}PREVIOUS_STEP`

export const ENABLE_NEXT_STEP = `${ACTION_PREFIX}ENABLE_NEXT_STEP`
export const DISABLE_NEXT_STEP = `${ACTION_PREFIX}DISABLE_NEXT_STEP`

export const CLEAR = `${ACTION_PREFIX}CLEAR`

export const CANCEL_LIMIT_FINDING = `${ACTION_PREFIX}CANCEL_LIMIT_FINDING`

export const RUN_LIMIT_FINDING = `${ACTION_PREFIX}RUN_LIMIT_FINDING`
export const RUN_LIMIT_FINDING_SUCCESS = `${RUN_LIMIT_FINDING}_SUCCESS`
export const RUN_LIMIT_FINDING_ERROR = `${RUN_LIMIT_FINDING}_ERROR`

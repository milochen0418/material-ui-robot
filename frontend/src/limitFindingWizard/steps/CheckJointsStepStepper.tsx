import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import {Button} from 'components'
import {serverUrl} from 'config'
import * as Styled from './StepsStyled'
import {StepProps} from './types'

const doneStepName = 'CheckJointsDone'

const CheckJointsStepStepper: React.FC<StepProps> = ({enableNextStep, disableNextStep, selectedRobot}) => {
    const {t} = useTranslation()
    const [jointIndex, setJointIndex] = useState(0)
    const [isDone, setIsDone] = useState(false)
    const doneIndex = selectedRobot.joints.length
    useEffect(() => {
        if (selectedRobot.joints.length === 0) {
            setIsDone(true)
        }
    }, [])

    useEffect(() => {
        if (isDone) {
            enableNextStep()
        } else {
            disableNextStep()
        }
    }, [isDone])

    const goToNextJoint = () => {
        const nextJointIndex = jointIndex + 1
        if (nextJointIndex >= doneIndex) {
            setIsDone(true)
        }

        setJointIndex(nextJointIndex)
    }

    return (
        <Styled.Step>
            <Styled.StepQuestion>
                {t('Check all robot joints')}
            </Styled.StepQuestion>
            <Styled.StepHelpText>
                {t('Joint by joint make sure that they are in desired position')}
            </Styled.StepHelpText>
            <Styled.StepContent>
                <Stepper activeStep={jointIndex} orientation="vertical">
                    {[...selectedRobot.joints, doneStepName].map(joint => (
                        <Step key={joint}>
                            <StepLabel>{joint === doneStepName ? t('Done') : joint}</StepLabel>
                            <Styled.StepJointContent>
                                {joint !== doneStepName ?  (
                                    <>
                                        <Styled.StepJointImage src={serverUrl + selectedRobot.files.joints[joint]} />
                                        <Styled.JointMoveControl
                                            joint={joint}
                                            robot={selectedRobot}
                                        />
                                    </>
                                ) : (
                                    <Styled.StepJointDone>
                                        {t('Congrats! You checked all the joints. Click "Next Step" below.')}
                                    </Styled.StepJointDone>
                                )}
                                <Styled.StepJointButtons>
                                    {jointIndex > 0 && (
                                        <Button
                                            color="default"
                                            onClick={() => setJointIndex(jointIndex - 1)}
                                        >
                                            {t('See previous')}
                                        </Button>
                                    )}
                                    {joint !== doneStepName && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={goToNextJoint}
                                        >
                                            {t('Set correctly')}
                                        </Button>
                                    )}
                                </Styled.StepJointButtons>
                            </Styled.StepJointContent>
                        </Step>
                    ))}
                </Stepper>
            </Styled.StepContent>
        </Styled.Step>
    )
}

export default CheckJointsStepStepper

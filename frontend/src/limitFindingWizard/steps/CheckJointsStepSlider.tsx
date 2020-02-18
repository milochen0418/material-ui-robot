import React, {useState, useCallback, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import SwipeableViews from 'react-swipeable-views'
// ts file is missing for 'react-swipeable-views-utils'
// tslint:disable-next-line:ban-ts-ignore
// @ts-ignore
import {bindKeyboard, virtualize} from 'react-swipeable-views-utils'
import useDimensions from 'react-use-dimensions'
import {isTouchDevice} from 'utils'
import {groupJoints, getBaseJointName} from './selectors'
import * as Styled from './StepsStyled'
import {StepProps} from './types'
import {serverUrl} from 'config'

const BindKeyboardSwipeableViews = bindKeyboard(virtualize(SwipeableViews))
const IMAGE_RATIO = 656 / 799

const getJointIndex = (index: number, allJointsSize: number): number => {
    const mod = index % allJointsSize
    return mod < 0 ? mod + allJointsSize : mod
}

const CheckJointsStepSlider: React.FC<StepProps> = ({selectedRobot}) => {
    const groupedJoints = groupJoints(selectedRobot.joints)
    const allJoints = groupedJoints.reduce((joints, group) => [...joints, ...group], [])

    const {t} = useTranslation()
    const [selectedJoint, selectJoint] = useState('')
    const [slideIndex, setSlideIndex] = useState(0)
    const [useDimensionsRef, dimensions] = useDimensions()
    const imageWidth = dimensions.height ?
        dimensions.height * IMAGE_RATIO :
        null

    useEffect(() => {
        if (selectedJoint) {
            const jointIndex = allJoints.findIndex((joint) => joint.endsWith(selectedJoint))
            if (jointIndex !== -1) {
                setSlideIndex(jointIndex)
            }
        }
    }, [selectedJoint, setSlideIndex])
    useEffect(() => {
        if (groupedJoints && groupedJoints.length > 0) {
            selectJoint(getBaseJointName(groupedJoints[0][0]))
        }
    }, [groupedJoints, selectJoint])

    const onSlideChange = useCallback((index: number): void => {
        setSlideIndex(index)
        selectJoint(getBaseJointName(allJoints[getJointIndex(index, allJoints.length)]))
    }, [setSlideIndex, selectJoint])

    const handleJointChange = (event: React.ChangeEvent<{value: unknown}>) => {
        selectJoint(event.target.value as string)
    }

    const showArrows = !isTouchDevice()

    return (
        <Styled.Step>
            <Styled.StepQuestion>
                {t('Check all robot joints')}
            </Styled.StepQuestion>
            <Styled.StepHelpText>
                {t('Joint by joint make sure that they are in desired position')}
                <Styled.StepJointControls isCentered>
                    <FormControl>
                        <InputLabel id="limit-finding-joint-selector-label">
                            {t('Selected joint')}
                        </InputLabel>
                        <Select
                            labelId="limit-finding-joint-selector-label"
                            id="limit-finding-joint-selector"
                            value={selectedJoint}
                            onChange={handleJointChange}
                        >
                            {groupedJoints.map(joints => (
                                <MenuItem
                                    key={joints[0]}
                                    value={getBaseJointName(joints[0])}
                                >
                                    {getBaseJointName(joints[0])}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Styled.StepJointControls>
            </Styled.StepHelpText>
            <Styled.StepSlider
                ref={useDimensionsRef}
                imageWidth={imageWidth}
            >
                <BindKeyboardSwipeableViews
                    enableMouseEvents
                    index={slideIndex}
                    onChangeIndex={onSlideChange}
                    slideRenderer={(params: {key: string, index: number}): JSX.Element => {
                        const joint = allJoints[getJointIndex(params.index, allJoints.length)]
                        return  (
                            <Styled.SliderCard
                                key={params.key}
                                backgroundImage={serverUrl + selectedRobot.files.cube}
                            >
                                <Styled.StepJointSliderRobotName>
                                    {joint}
                                </Styled.StepJointSliderRobotName>
                                <Styled.StepJointSliderActions>
                                    <Styled.JointMoveControl
                                        joint={joint}
                                        robot={selectedRobot}
                                        skipTextDisplay
                                    />
                                </Styled.StepJointSliderActions>
                            </Styled.SliderCard>
                        )
                    }}
                />
                {showArrows && (
                    <>
                        <Styled.IconButton onClick={() => onSlideChange(slideIndex - 1)}>
                            <KeyboardArrowLeftIcon />
                        </Styled.IconButton>
                        <Styled.IconButton isRight onClick={() => onSlideChange(slideIndex + 1)}>
                            <KeyboardArrowRightIcon />
                        </Styled.IconButton>
                    </>
                )}
            </Styled.StepSlider>
        </Styled.Step>
    )
}

export default CheckJointsStepSlider

import React from 'react'
import {Dispatch} from 'redux'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import Fab from '@material-ui/core/Fab'
import RemoveIcon from '@material-ui/icons/Remove'
import AddIcon from '@material-ui/icons/Add'
import {Robot} from 'types'
import {moveJoint as moveJointAction} from 'robotOperations'

interface Props {
    className?: string,
    moveJoint: (isPositiveDirection: boolean) => void,
    skipTextDisplay?: boolean,
}

interface ContainerProps {
    className?: string,
    robot: Robot,
    joint: string,
    skipTextDisplay?: boolean,
}

const Content = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const StyledFab = styled(Fab)`
    margin-left: 30px!important;

    &:first-child {
        margin-left: 0!important;
    }
`

export const JointMoveControl: React.FC<Props> = ({className, moveJoint, skipTextDisplay}) => {
    const {t} = useTranslation()

    return (
        <Content className={className}>
            {!skipTextDisplay && t('Adjust joint position')}
            <StyledFab
                color="default"
                size="small"
                onClick={() => moveJoint(false)}
            >
                <RemoveIcon />
            </StyledFab>
            <StyledFab
                size="small"
                color="primary"
                onClick={() => moveJoint(true)}
            >
                <AddIcon />
            </StyledFab>
        </Content>
    )
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: ContainerProps) => ({
    moveJoint: (isPositiveDirection: boolean) =>
        dispatch(moveJointAction(ownProps.robot, ownProps.joint, isPositiveDirection)),
})

export default connect(null, mapDispatchToProps)(JointMoveControl) as React.ComponentType<ContainerProps>

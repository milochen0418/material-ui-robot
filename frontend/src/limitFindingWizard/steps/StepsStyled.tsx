import styled from 'styled-components'
import MaterialStepContent from '@material-ui/core/StepContent'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import MaterialCard from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import MaterialIconButton from '@material-ui/core/IconButton'
import {JointMoveControl as JointMoveComponent} from 'components'
import {error, secondaryHeader, success, primary} from '../../colors'

export const Step = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
`

export const StepQuestion = styled.div`
    font-size: 1.625rem;
    font-weight: 500;
    margin-bottom: 12px;
    color: ${(props: {hasError?: boolean}) => (props.hasError ? error : 'inherit')};
`

export const StepHelpText = styled.div`
    color: ${secondaryHeader};
    font-family: ${(props: {isError?: boolean}) => (props.isError ? 'monospace' : 'inherit')};
    font-size: ${(props: {isError?: boolean}) => (props.isError ? '1.5rem' : '1rem')};
    text-align: center;
`

export const StepJointControls = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: ${(props: {isCentered?: boolean}): string => (props.isCentered ? 'center' : 'space-between')};
    margin: 5px 0 20px 0;
    text-align: left;

    > :last-child {
        min-width: 150px;
    }
`

export const StepSwitchWrapper = styled.div`
    margin-right: 10px;
`

export const StepContent = styled.div`
    flex: 1;
    width: 700px;
    max-width: 80vw;
    text-align: ${(props: {isProgressWrapper?: boolean}) => (props.isProgressWrapper ? 'center' : 'left')};
    margin-top: ${(props: {isProgressWrapper?: boolean}) => (props.isProgressWrapper ? '36' : '0')}px;

    .MuiStepConnector-lineVertical {
        min-height: 8px;
    }
`

export const StepImage = styled.div`
    flex: 1;
    width: 100%;
    margin: 24px 0;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: ${(props: {src: string}) => `url(${props.src})`};
`

export const StepJointContent = styled(MaterialStepContent)`
  padding-left: 36px!important;
`

export const StepJointImage = styled.div`
    margin: 12px 0 24px 0;
    height: 320px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center left;
    background-image: ${(props: {src: string}) => `url(${props.src})`};
`

export const JointMoveControl = styled(JointMoveComponent)`
    margin: 16px;
    justify-content: space-between;

    button {
        flex-shrink: 0;
        width: 48px!important;
        height: 48px!important;
        line-height: 48px!important;
    }

    @media (min-width: 720px) {
        justify-content: flex-end;
    }
`

export const StepJointButtons = styled.div`
    margin-top: 12px;

    button {
        margin-right: 12px;
    }
`

export const StepJointDone = styled.div`
    margin-top: 12px;
    font-size: 1rem;
`

export const SuccessIcon = styled(CheckCircleOutlineIcon)`
    margin: 30px auto 0 auto;
    display: block!important;
    font-size: 6rem!important;
    color: ${success};
`

interface CardProps {
    position?: 'left' | 'center' | 'right',
    showBigImages: boolean,
}

const getGridSpanForCardFor2ColumnLayout = (props: CardProps) => {
    if (props.position === 'left') {
        return '1 / span 49'
    }

    if (props.position === 'right') {
        return '51 / span 49'
    }

    return '25 / span 50'
}

export const Card = styled(MaterialCard)`
    grid-column: 1 / span 100;

    @media (min-width: 580px) {
        grid-column: ${(props: CardProps): string => (
            props.showBigImages ?
                '1 / span 100' :
                getGridSpanForCardFor2ColumnLayout(props)
        )};
    }
`

export const StepSlider = styled.div`
    width: calc(100vw - 50px);
    margin: 0 auto;
    flex: 1;
    position: relative;

    > div {
        min-height: 100%;
        height: 100%;
        padding-left: ${(props: {imageWidth: number | null}): string => (
            props.imageWidth ?
                `calc((100% - ${props.imageWidth}px) / 2)` :
                '20%')};
        padding-right: ${(props: {imageWidth: number | null}): string => (
            props.imageWidth ?
                `calc((100% - ${props.imageWidth}px) / 2)` :
                '20%')};
        > div {
            min-height: 100%;
            > div {
                min-height: 100%;
                padding: 10px;

                .MuiCard-root {
                    min-height: 100%;
                }
            }
        }
    }
`

export const SliderCard = styled(MaterialCard)`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-image: ${(props: {backgroundImage: string}): string => `url(${props.backgroundImage})`};
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
`

export const StepJointSliderRobotName = styled(CardContent)`
    text-align: center;
    font-weight: 500;
    font-size: 1rem;
    word-break: break-all;
    background: rgba(255, 255, 255, 0.5);
`

export const StepJointSliderActions = styled.div`
`

export const IconButton = styled(MaterialIconButton)`
    position: absolute!important;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(255,82,0,0.12)!important;
    ${(props: {isRight?: boolean}): string => {
        if (props.isRight) {
            return 'right: 1rem;'
        }

        return 'left: 1rem;'
    }}

    &:hover {
        background-color: rgba(255,82,0,0.3)!important;
    }

    .MuiSvgIcon-root {
        font-size: 7rem;
        color: ${primary};
    }
`

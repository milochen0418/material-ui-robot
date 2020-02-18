import styled from 'styled-components'
import {background} from '../colors'

export const LimitFindingWizard = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: -16px;
    padding: 16px;
    background: ${background};
`

export const LimitFindingWizardSteps = styled.div`
    .MuiPaper-root {
        background: ${background};
    }

    .MuiSvgIcon-root {
        width: 2rem;
        height: 2rem;
    }

    .MuiStepIcon-text {
        font-size: 1rem;
        transform: translate(0px, 1px);
    }
`

export const LimitFindingWizardContent = styled.div`
    flex-direction: column;
    display: flex;
    flex: 1;
    padding: 0 0 16px 0;
`

export const LimitFindingWizardFooter = styled.div`
    display: flex;
    align-items: center;
    justify-content: ${(props: {isDone: boolean}) => (props.isDone ? 'center' : 'space-between')};

    @media (max-width: 480px) {
        flex-direction: column-reverse;

        button {
            width: 80%;
            margin: 0 auto 12px auto;
        }
    }
`

export const MainButtons = styled.div`
    display: flex;

    @media (max-width: 480px) {
        flex-direction: column-reverse;
        align-self: stretch;
    }

    @media (min-width: 481px) {
         button {
            margin-left: 20px;
        }
    }
`

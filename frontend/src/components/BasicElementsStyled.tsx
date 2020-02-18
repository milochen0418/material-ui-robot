import React from 'react'
import styled from 'styled-components'
import MaterialButton, {ButtonProps} from '@material-ui/core/Button'
import {secondaryHeader} from '../colors'

export const Title = styled.h1`
    text-align: center;
`

export const CardTitle = styled.h3`
    margin: 0 0 12px 0;
    font-weight: 500;
    color: ${secondaryHeader};
`

export const CardContentFullWidth = styled.div`
    margin-left: -16px;
    margin-right: -16px;
`

export const Button: React.ComponentType<ButtonProps> = styled(MaterialButton)``

import React from 'react'
import {renderWithRouter} from 'utils'
import LimitFindingWizard from './LimitFindingWizard'

test('renders all elements', () => {
  const {queryByText, queryByTestId} = renderWithRouter(<LimitFindingWizard />)
  expect(queryByText(/check robot position/i)).toBeInTheDocument()
  expect(queryByText(/check joints/i)).toBeInTheDocument()
  expect(queryByText(/run limit finding/i)).toBeInTheDocument()
  expect(queryByText(/done/i)).toBeInTheDocument()
  expect(queryByTestId('limitFindingPreviousAction')).not.toBeInTheDocument()
  expect(queryByTestId('limitFindingNextAction')).toBeInTheDocument()
})

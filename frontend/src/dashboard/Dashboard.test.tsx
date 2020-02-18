import React from 'react'
import {renderWithRouter} from 'utils'
import Dashboard from './DashboardContainer'

test('renders all elements', () => {
  const {queryByText} = renderWithRouter(<Dashboard />)
  const robotStatusCard = queryByText(/robot status/i)
  expect(robotStatusCard).toBeInTheDocument()
  const actionsCard = queryByText(/Actions/)
  expect(actionsCard).toBeInTheDocument()
})

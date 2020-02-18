/* tslint:disable:no-empty */
import React from 'react'
import {fireEvent} from '@testing-library/react'
import {renderWithRouter} from 'utils'
import LimitFindingWizardFooter from './LimitFindingWizardFooter'

describe('LimitFindingWizard footer should', () => {
  const baseProps = {
    canGoNext: true,
    canGoPrevious: true,
    cancel: () => {},
    clear: () => {},
    goToNextStep: () => {},
    goToPreviousStep: () => {},
    isDone: false,
  }

  test('render proper buttons when process is finished', () => {
    const props = {
        ...baseProps,
      isDone: true,
    }
    const {queryByTestId} = renderWithRouter(<LimitFindingWizardFooter {...props} />)
    expect(queryByTestId('limitFindingPreviousAction')).not.toBeInTheDocument()
    expect(queryByTestId('limitFindingNextAction')).not.toBeInTheDocument()
    expect(queryByTestId('limitFindingCancelAction')).not.toBeInTheDocument()
    expect(queryByTestId('limitFindingDashboardAction')).toBeInTheDocument()
  })

  test('render buttons in proper state if canGoNext is true and canGoPrevious is false', () => {
    const props = {
        ...baseProps,
      canGoNext: true,
      canGoPrevious: false,
      goToNextStep: jest.fn(),
      goToPreviousStep: jest.fn(),
    }
    const {queryByTestId, getByTestId} = renderWithRouter(<LimitFindingWizardFooter {...props} />)
    expect(queryByTestId('limitFindingNextAction')).toBeInTheDocument()
    expect(getByTestId('limitFindingNextAction').closest('button')).not.toHaveAttribute('disabled')
    expect(queryByTestId('limitFindingPreviousAction')).not.toBeInTheDocument()
    expect(queryByTestId('limitFindingDashboardAction')).not.toBeInTheDocument()
    expect(queryByTestId('limitFindingCancelAction')).toBeInTheDocument()

    expect(props.goToNextStep).not.toHaveBeenCalled()
    fireEvent.click(getByTestId('limitFindingNextAction'))
    expect(props.goToNextStep).toHaveBeenCalled()
  })

  test('render buttons in proper state if canGoNext is false and canGoPrevious is true', () => {
    const props = {
        ...baseProps,
      canGoNext: false,
      canGoPrevious: true,
      goToNextStep: jest.fn(),
      goToPreviousStep: jest.fn(),
    }
    const {queryByTestId, getByTestId} = renderWithRouter(<LimitFindingWizardFooter {...props} />)
    expect(queryByTestId('limitFindingPreviousAction')).toBeInTheDocument()
    expect(getByTestId('limitFindingPreviousAction').closest('button')).not.toHaveAttribute('disabled')
    expect(queryByTestId('limitFindingNextAction')).toBeInTheDocument()
    expect(getByTestId('limitFindingNextAction').closest('button')).toHaveAttribute('disabled')
    expect(queryByTestId('limitFindingDashboardAction')).not.toBeInTheDocument()
    expect(queryByTestId('limitFindingCancelAction')).toBeInTheDocument()

    expect(props.goToPreviousStep).not.toHaveBeenCalled()
    fireEvent.click(getByTestId('limitFindingPreviousAction'))
    expect(props.goToPreviousStep).toHaveBeenCalled()

    // disabled button - click shouldn't trigger event
    expect(props.goToNextStep).not.toHaveBeenCalled()
    fireEvent.click(getByTestId('limitFindingNextAction'))
    expect(props.goToNextStep).not.toHaveBeenCalled()
  })

  test('call proper callback when cancel is called', () => {
    const props = {
        ...baseProps,
      cancel: jest.fn(),
    }
    const {getByTestId} = renderWithRouter(<LimitFindingWizardFooter {...props} />)

    expect(props.cancel).not.toHaveBeenCalled()
    fireEvent.click(getByTestId('limitFindingCancelAction'))
    expect(props.cancel).toHaveBeenCalled()
  })
})

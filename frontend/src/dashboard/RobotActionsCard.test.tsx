/* tslint:disable:no-empty */
import React from 'react'
import {renderWithRouter} from 'utils'
import RobotActionsCard from './RobotActionsCard'

describe('RobotActionsCard should', () => {
  const baseProps = {
    actions: [
      {localeKey: 'Test1', main: true, actionKey: 'testAction'},
      {localeKey: 'Test2'},
    ],
    availableActions: {
      testAction: () => {},
    },
    robot: {
      healthStatus: {
        limitFindingStatus: 'ok',
        manualControl: true,
        powerOnSelfTestSuccessful: true,
      },
      id: 'testId',
      joints: ['left', 'right'],
      lastKeepAliveReceivedAt: new Date(),
      name: 'Rico',
    },
  }

  test('render nothing when robot is not provided', () => {
    const {queryByText} = renderWithRouter(<RobotActionsCard {...baseProps} robot={null} />)
    expect(queryByText(/actions/i)).toBeNull()
  })

  test('RobotActionsCard renders proper robot data when it is provided in offline mode', () => {
    const props = {
        ...baseProps,
        robot: {
            ...baseProps.robot,
          lastKeepAliveReceivedAt: undefined,
        },
    }
    const {getByText} = renderWithRouter(<RobotActionsCard {...props} />)
    const header = getByText(/Actions/)
    expect(header).toBeInTheDocument()
    const offlineMessage = getByText(/robot is offline/i)
    expect(offlineMessage).toBeInTheDocument()
    const toolsButton = getByText(/view all tools/i)
    expect(toolsButton).toBeInTheDocument()
  })

  test('RobotActionsCard renders proper robot data when it is provided in online mode', () => {
    const {getByText, queryByText} = renderWithRouter(<RobotActionsCard {...baseProps} />)
    const header = getByText(/Actions/)
    expect(header).toBeInTheDocument()

    const offlineMessage = queryByText(/robot is offline/i)
    expect(offlineMessage).not.toBeInTheDocument()

    expect(getByText(/Test1/)).toBeInTheDocument()
    expect(getByText(/Test2/)).toBeInTheDocument()

    const noActionsMessage = queryByText(/no actions to perform/i)
    expect(noActionsMessage).not.toBeInTheDocument()

    const toolsButton = getByText(/view all tools/i)
    expect(toolsButton).toBeInTheDocument()
  })

  test('RobotActionsCard renders proper robot data when it is provided in online mode and no actions', () => {
    const props = {
      ...baseProps,
      actions: [],
    }
    const {getByText, queryByText} = renderWithRouter(<RobotActionsCard {...props} />)
    const header = getByText(/Actions/)
    expect(header).toBeInTheDocument()

    const offlineMessage = queryByText(/robot is offline/i)
    expect(offlineMessage).not.toBeInTheDocument()

    expect(queryByText(/Test1/)).not.toBeInTheDocument()
    expect(queryByText(/Test2/)).not.toBeInTheDocument()

    const noActionsMessage = queryByText(/no actions to perform/i)
    expect(noActionsMessage).toBeInTheDocument()

    const toolsButton = getByText(/view all tools/i)
    expect(toolsButton).toBeInTheDocument()
  })
})

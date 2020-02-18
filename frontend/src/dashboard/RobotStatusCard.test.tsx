import {render} from '@testing-library/react'
import React from 'react'
import {SimpleStatus, Status} from 'types'
import RobotStatusCard from './RobotStatusCard'

test('RobotStatusCard renders loader when robot is not provided', () => {
  const {getByText, container} = render(
      <RobotStatusCard
          robot={null}
          isChangingManualMode={false}
          toggleManualMode={jasmine.createSpy()}
      />
    )
  const header = getByText(/robot status/i)
  expect(header).toBeInTheDocument()
  const loader = container.querySelector('[role="progressbar"]')
  expect(loader).toBeInTheDocument()
})

test('RobotStatusCard renders robot data when it is provided', () => {
  const robot = {
    healthStatus: {
      limitFindingStatus: Status.OK,
      manualControl: SimpleStatus.YES,
      powerOnSelfTestStatus: Status.OK,
    },
    id: 'testId',
    joints: ['left', 'right'],
    lastKeepAliveReceivedAt: new Date(),
    name: 'Rico',
  }

  const {getByText, getByTestId, container} = render(
      <RobotStatusCard
          robot={robot}
          isChangingManualMode={false}
          toggleManualMode={jasmine.createSpy()}
      />
    )
  const header = getByText(/robot status/i)
  expect(header).toBeInTheDocument()
  const loader = container.querySelector('[role="progressbar"]')
  expect(loader).not.toBeInTheDocument()
  const name = getByText(robot.name)
  expect(name).toBeInTheDocument()
  const joints = getByText(robot.joints.slice(0, 2).join(', ') + ',')
  expect(joints).toBeInTheDocument()
  const limitFindingStatus = getByTestId('statusCardLimitFindingValue')
  expect(limitFindingStatus).toBeInTheDocument()
  expect(limitFindingStatus.textContent).toEqual('OK')
  const powerOnSelfTestSuccessful = getByTestId('statusCardPowerOnValue')
  expect(powerOnSelfTestSuccessful).toBeInTheDocument()
  expect(powerOnSelfTestSuccessful.textContent).toEqual('OK')
})

test('RobotStatusCard renders progress when manual control is loading', () => {
  const robot = {
    healthStatus: {
      limitFindingStatus: Status.OK,
      manualControl: SimpleStatus.NO,
      powerOnSelfTestStatus: Status.OK,
    },
    id: 'testId',
    joints: ['left', 'right'],
    lastKeepAliveReceivedAt: new Date(),
    name: 'Rico',
  }

  const {getByText, getByTestId, container} = render(
      <RobotStatusCard
          robot={robot}
          isChangingManualMode
          toggleManualMode={jasmine.createSpy()}
      />
    )
  const header = getByText(/robot status/i)
  expect(header).toBeInTheDocument()
  const loader = container.querySelector('[role="progressbar"]')
  expect(loader).toBeInTheDocument()
  const name = getByText(robot.name)
  expect(name).toBeInTheDocument()
  const joints = getByText(robot.joints.slice(0, 2).join(', ') + ',')
  expect(joints).toBeInTheDocument()
  const limitFindingStatus = getByTestId('statusCardLimitFindingValue')
  expect(limitFindingStatus).toBeInTheDocument()
  expect(limitFindingStatus.textContent).toEqual('OK')
  const powerOnSelfTestSuccessful = getByTestId('statusCardPowerOnValue')
  expect(powerOnSelfTestSuccessful).toBeInTheDocument()
  expect(powerOnSelfTestSuccessful.textContent).toEqual('OK')
})

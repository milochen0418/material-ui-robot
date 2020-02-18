import moment from 'moment'
import {Robot} from 'types'
import {isRobotOnline} from './robot'

test('utils - robot - isRobotOnline should return proper values', () => {
  const moreThan5MinutesAgo = moment().add(-5, 'minutes').add(-1, 'seconds').toDate()
  const lessThan5MinutesAgo = moment().add(-5, 'minutes').add(30, 'seconds').toDate()
  const future = moment().add(5, 'minutes').toDate()
  expect(isRobotOnline({} as Robot)).toBeFalsy()
  expect(isRobotOnline({lastKeepAliveReceivedAt: moreThan5MinutesAgo} as Robot)).toBeFalsy()
  expect(isRobotOnline({lastKeepAliveReceivedAt: lessThan5MinutesAgo} as Robot)).toBeTruthy()
  expect(isRobotOnline({lastKeepAliveReceivedAt: future} as Robot)).toBeTruthy()
})

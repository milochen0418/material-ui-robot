import {buildAction} from './actionBuilders'

test('action builders - buildAction should create proper action', () => {
  const type = 'FAKE_ACTION'
  const action = buildAction(type, 'param1', 'param2')
  const result1 = action(1, 'some string')
  const result2 = action(1, 'some string', 'another string')
  const result3 = action()
  expect(result1).toEqual({
    param1: 1,
    param2: 'some string',
    type,
  })
  expect(result2).toEqual({
    param1: 1,
    param2: 'some string',
    type,
  })
  expect(result3).toEqual({
    type,
  })
})

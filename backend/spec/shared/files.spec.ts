import {getRobotFile} from '@shared'

describe('File utilities', () => {
    it(`should return proper files for robot`, () => {
        expect(getRobotFile('test', 'testFile-horizontal'))
            .toBe('/api/files/models/test/testFile-horizontal.jpg')
        expect(getRobotFile('test', 'testFile-dot'))
            .toBe('/api/files/models/default/testFile-dot.jpg')
        expect(getRobotFile('default', 'testFile-horizontal'))
            .toBe('/api/files/models/default/testFile-horizontal.jpg')
    })
})

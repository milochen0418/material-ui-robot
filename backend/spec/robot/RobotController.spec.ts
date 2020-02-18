import app from '@server'
import supertest, {Response, SuperTest, Test} from 'supertest'
import {BAD_REQUEST, NOT_MODIFIED, OK, UNAUTHORIZED} from 'http-status-codes'
import * as shared from '@shared'
import {IMqttClient, IRobotAccess, IRobotRepository, TYPES} from '@dataAccess'
import {Robot, SimpleStatus, Status} from '@entities'
import Container from '@container'
import {createTestJWT, wait} from '../testUtils'

describe('Robot Controller Routes', () => {

    const siteId = 'testSiteId'
    const basePath = `/api/${siteId}/robot`
    const getRobotsPath = `${basePath}/`
    const runLimitFindingPath = `${basePath}/:robotId/runLimitFinding`
    const cancelLimitFindingPath = `${basePath}/:robotId/cancelLimitFinding`
    const moveJoint = `${basePath}/:robotId/moveJoint`
    const setManualControl = `${basePath}/:robotId/setManualControl`

    const mqttClient = Container.get<IMqttClient>(TYPES.MqttClient)
    const robotAccess = Container.get<IRobotAccess>(TYPES.RobotAccess)
    const robotRepository = Container.get<IRobotRepository>(TYPES.RobotRepository)
    const jwt = createTestJWT()

    let agent: SuperTest<Test>
    let returnErrorWhenMakingRequest = false

    function mockMakeRequest() {
        return returnErrorWhenMakingRequest ?
            Promise.reject({message: 'test error'}) :
            Promise.resolve({success: true})
    }

    const baseMockRobot: Robot = {
        id: 'mockRobot1',
        name: 'mockRobot1',
        model: 'default',
        healthStatus: {
            limitFindingStatus: Status.OK,
            manualControl: SimpleStatus.YES,
            powerOnSelfTestStatus: Status.OK,
            emergencyStop: false,
        },
        lastKeepAliveReceivedAt: new Date(),
        joints: ['left_arm', 'right_arm'],
        files: {
            cube: 'fakeFile',
            joints: {
                left_arm: 'fakeFile',
                right_arm: 'fakeFile',
            },
        },
    }

    const baseHealthStatusNotification = {
        manual_control: SimpleStatus.YES,
        limit_finding: Status.NOT_RUN_YET,
        emergency_stop: false,
        robot_name: 'mockRobot1',
        power_on_self_test: Status.OK,
    }

    beforeAll(() => {
        agent = supertest.agent(app)
        spyOn(robotAccess, 'runLimitFinding').and.callThrough()
        spyOn(robotAccess, 'cancelLimitFinding').and.callThrough()
        spyOn(robotAccess, 'moveJoint').and.callThrough()
        spyOn(robotAccess, 'setManualControl').and.returnValue(Promise.resolve())
        spyOn(robotAccess, 'getJoints').and.returnValue(Promise.resolve(baseMockRobot.joints))
        spyOn(mqttClient, 'makeRequest').and.callFake(mockMakeRequest)
    })

    beforeEach(async () => {
        returnErrorWhenMakingRequest = false
        spyOn(shared, 'getRobotFile').and.returnValue('fakeFile')
        await robotRepository.clear(siteId)
    })

    afterEach(async () => {
        await robotRepository.clear(siteId);
        (robotAccess.runLimitFinding as jasmine.Spy).calls.reset();
        (robotAccess.cancelLimitFinding as jasmine.Spy).calls.reset();
        (robotAccess.moveJoint as jasmine.Spy).calls.reset();
        (robotAccess.setManualControl as jasmine.Spy).calls.reset();
        (robotAccess.getJoints as jasmine.Spy).calls.reset()
    })

    describe(`"GET:${getRobotsPath}"`, () => {
        it(`should return proper data of robots in response after joints are fetched`, async (done) => {
            const mockRobot = {
                ...baseMockRobot,
            }

            robotAccess.onRobotJoined(siteId, {
                ...baseHealthStatusNotification,
                limit_finding: Status.OK,
            })

            await wait(70)

            agent
                .get(getRobotsPath)
                .set('Authorization', `Bearer ${jwt}`)
                .end((err: Error, res: Response) => {
                    expect(res.status).toBe(OK)
                    expect(res.body.length).toBe(1)
                    expect(res.body[0].id).toBe(mockRobot.id)
                    expect(res.body[0].healthStatus).toEqual(mockRobot.healthStatus)
                    expect(new Date(res.body[0].lastKeepAliveReceivedAt).getTime())
                        .toBeGreaterThanOrEqual((mockRobot.lastKeepAliveReceivedAt as Date).getTime())
                    expect(res.body[0].model).toEqual(mockRobot.model)
                    expect(res.body[0].joints).toEqual(mockRobot.joints)
                    expect(res.body[0].files).toEqual(mockRobot.files)
                    expect(res.body.error).toBeUndefined()
                    done()
                })
        })

        it(`should return proper number of robots in response`, async (done) => {
            robotAccess.onRobotJoined(siteId, {
                ...baseHealthStatusNotification,
                robot_name: baseMockRobot.id,
                limit_finding: Status.NOT_RUN_YET,
            })
            await wait()
            robotAccess.onRobotJoined(siteId, {
                ...baseHealthStatusNotification,
                robot_name: 'mockRobot2',
                limit_finding: Status.FAILED,
            })
            await wait()
            robotAccess.onRobotJoined(siteId, {
                ...baseHealthStatusNotification,
                robot_name: 'mockRobot3',
                limit_finding: Status.NOT_RUN_YET,
            })
            await wait()

            agent
                .get(getRobotsPath)
                .set('Authorization', `Bearer ${jwt}`)
                .end((err: Error, res: Response) => {
                    expect(res.status).toBe(OK)
                    expect(res.body.length).toBe(3)
                    expect(res.body.error).toBeUndefined()
                    done()
                })
        })

        it(`should require authorization for endpoint`, (done) => {
            agent
                .get(getRobotsPath)
                .end((err: Error, res: Response) => {
                    expect(res.status).toBe(UNAUTHORIZED)
                    done()
                })
        })
    })

    describe(`"POST:${runLimitFindingPath}"`, () => {
        it(`should return proper response if robot for given params is not found`, (done) => {
            robotAccess.onRobotJoined(siteId, {
                ...baseHealthStatusNotification,
                robot_name: baseMockRobot.id,
                limit_finding: Status.NOT_RUN_YET,
            })

            agent
                .post(`${basePath}/${baseMockRobot.id + 'wrong'}/runLimitFinding`)
                .set('Authorization', `Bearer ${jwt}`)
                .end((err: Error, res: Response) => {
                    expect(res.status).toBe(BAD_REQUEST)
                    expect(robotAccess.runLimitFinding).not.toHaveBeenCalled()
                    done()
                })
        })

        it(`should return proper response if limit finding is already run`, (done) => {
            robotAccess.onRobotJoined(siteId, {
                ...baseHealthStatusNotification,
                limit_finding: Status.OK,
                robot_name: baseMockRobot.id,
            })

            agent
                .post(`${basePath}/${baseMockRobot.id}/runLimitFinding`)
                .set('Authorization', `Bearer ${jwt}`)
                .end((err: Error, res: Response) => {
                    expect(res.status).toBe(NOT_MODIFIED)
                    expect(robotAccess.runLimitFinding).not.toHaveBeenCalled()
                    done()
                })
        })

        it(`should return proper response and call RobotAccess if limit finding finished with success`, async (done) => {
            const mockRobot = {
                ...baseMockRobot,
                healthStatus: {
                    limitFindingStatus: 'no',
                },
            }

            robotAccess.onRobotJoined(siteId, {...baseHealthStatusNotification, robot_name: mockRobot.id})

            agent
                .post(`${basePath}/${baseMockRobot.id}/runLimitFinding`)
                .set('Authorization', `Bearer ${jwt}`)
                .end((err: Error, res: Response) => {
                    expect(res.status).toBe(OK)
                    expect(robotAccess.runLimitFinding).toHaveBeenCalled()
                    done()
                })
        })

        it(`should return error if limit finding finished with error`, async (done) => {
            returnErrorWhenMakingRequest = true
            const mockRobot = {
                ...baseMockRobot,
                healthStatus: {
                    limitFindingStatus: 'no',
                },
            }

            robotAccess.onRobotJoined(siteId, {...baseHealthStatusNotification, robot_name: mockRobot.id})

            agent
                .post(`${basePath}/${baseMockRobot.id}/runLimitFinding`)
                .set('Authorization', `Bearer ${jwt}`)
                .end((err: Error, res: Response) => {
                    expect(res.status).toBe(BAD_REQUEST)
                    expect(robotAccess.runLimitFinding).toHaveBeenCalled()
                    expect(res.body.error).toEqual('test error')
                    done()
                })
        })
    })

    describe(`"POST:${cancelLimitFindingPath}"`, () => {
        it(`should return proper response if robot for given params is not found but shouldn't call RobotAccess`, (done) => {
            const mockRobot = {
                ...baseMockRobot,
                healthStatus: {
                    ...baseMockRobot.healthStatus,
                    limitFindingStatus: 'inProgress',
                },
            }

            robotAccess.onRobotJoined(siteId, {...baseHealthStatusNotification, robot_name: mockRobot.id})

            agent
                .post(`${basePath}/${baseMockRobot.id + 'wrong'}/cancelLimitFinding`)
                .set('Authorization', `Bearer ${jwt}`)
                .end((err: Error, res: Response) => {
                    expect(res.status).toBe(OK)
                    expect(robotAccess.cancelLimitFinding).not.toHaveBeenCalled()
                    done()
                })
        })

        it(`should return proper response if it was possible to send message to robot`, async (done) => {
            const mockRobot = {
                ...baseMockRobot,
                healthStatus: {
                    limitFindingStatus: 'inProgress',
                },
            }

            robotAccess.onRobotJoined(siteId, {...baseHealthStatusNotification, robot_name: mockRobot.id})

            agent
                .post(`${basePath}/${baseMockRobot.id}/cancelLimitFinding`)
                .set('Authorization', `Bearer ${jwt}`)
                .end((err: Error, res: Response) => {
                    expect(res.status).toBe(OK)
                    expect(robotAccess.cancelLimitFinding).toHaveBeenCalled()
                    done()
                })
        })
    })

    describe(`"POST:${moveJoint}"`, () => {
        it(`should return proper response if robot for given params is not found but shouldn't call RobotAccess`, (done) => {
            const mockRobot = {
                ...baseMockRobot,
                healthStatus: {
                    limitFindingStatus: 'no',
                },
            }

            robotAccess.onRobotJoined(siteId, {...baseHealthStatusNotification, robot_name: mockRobot.id})

            agent
                .post(`${basePath}/${baseMockRobot.id + 'wrong'}/moveJoint`)
                .set('Authorization', `Bearer ${jwt}`)
                .send({joint: 'left_arm', isPositiveDirection: false})
                .then((res: Response) => {
                    expect(res.status).toBe(BAD_REQUEST)
                    expect(robotAccess.moveJoint).not.toHaveBeenCalled()
                    done()
                })
        })

        it(`should return proper response if joint for robot is not found but shouldn't call RobotAccess`, (done) => {
            const mockRobot = {
                ...baseMockRobot,
                healthStatus: {
                    limitFindingStatus: 'no',
                },
            }

            robotAccess.onRobotJoined(siteId, {...baseHealthStatusNotification, robot_name: mockRobot.id})

            agent
                .post(`${basePath}/${baseMockRobot.id}/moveJoint`)
                .set('Authorization', `Bearer ${jwt}`)
                .send({joint: 'fake_joint', isPositiveDirection: false})
                .then((res: Response) => {
                    expect(res.status).toBe(BAD_REQUEST)
                    expect(robotAccess.moveJoint).not.toHaveBeenCalled()
                    done()
                })
        })

        // reenable once joints are fetched in next PR
        xit(`should return proper response if joint for robot is found and should call RobotAccess`, async (done) => {
            const mockRobot = {
                ...baseMockRobot,
            }

            robotAccess.onRobotJoined(siteId, {...baseHealthStatusNotification, robot_name: mockRobot.id})

            agent
                .post(`${basePath}/${baseMockRobot.id}/moveJoint`)
                .set('Authorization', `Bearer ${jwt}`)
                .send({joint: 'left_arm', isPositiveDirection: true})
                .then((res: Response) => {
                    expect(res.status).toBe(OK)
                    expect(robotAccess.moveJoint).toHaveBeenCalled()
                    const {args} = (robotAccess.moveJoint as jasmine.Spy).calls.mostRecent()
                    expect((args[0] as Robot).id).toBe(mockRobot.id)
                    expect(args[1]).toBe('left_arm')
                    expect(args[2]).toBe(true)
                    done()
                })
        })
    })

    describe(`"POST:${setManualControl}"`, () => {
        it(`should return proper response if robot for given params is not found but shouldn't call RobotAccess`, async (done) => {
            const mockRobot = {
                ...baseMockRobot,
                healthStatus: {
                    limitFindingStatus: 'no',
                    manualControl: true,
                },
            }

            robotAccess.onRobotJoined(siteId, {...baseHealthStatusNotification, robot_name: mockRobot.id})
            await wait()

            agent
                .post(`${basePath}/${baseMockRobot.id + 'wrong'}/setManualControl`)
                .set('Authorization', `Bearer ${jwt}`)
                .send({enable: false})
                .then((res: Response) => {
                    expect(res.status).toBe(BAD_REQUEST)
                    expect(robotAccess.setManualControl).not.toHaveBeenCalled()
                    done()
                })
        })

        it(`should return proper response if robot for given params has value as expected but shouldn't call RobotAccess`, async (done) => {
            const mockRobot = {
                ...baseMockRobot,
                healthStatus: {
                    limitFindingStatus: 'no',
                    manualControl: true,
                },
            }

            robotAccess.onRobotJoined(siteId, {...baseHealthStatusNotification, robot_name: mockRobot.id})
            await wait()

            agent
                .post(`${basePath}/${baseMockRobot.id}/setManualControl`)
                .set('Authorization', `Bearer ${jwt}`)
                .send({enable: true})
                .then((res: Response) => {
                    expect(res.status).toBe(OK)
                    expect(robotAccess.setManualControl).not.toHaveBeenCalled()
                    done()
                })
        })

        it(`should return proper response when change is finished`, async (done) => {
            const mockRobot = {
                ...baseMockRobot,
                healthStatus: {
                    ...baseMockRobot.healthStatus,
                    manualControl: true,
                },
            }

            robotAccess.onRobotJoined(siteId, {...baseHealthStatusNotification, robot_name: mockRobot.id})
            await wait()

            agent
                .post(`${basePath}/${baseMockRobot.id}/setManualControl`)
                .set('Authorization', `Bearer ${jwt}`)
                .send({enable: false})
                .then((res: Response) => {
                    expect(res.status).toBe(OK)
                    expect(robotAccess.setManualControl).toHaveBeenCalled()
                    const {args} = (robotAccess.setManualControl as jasmine.Spy).calls.mostRecent()
                    expect((args[0] as Robot).id).toBe(mockRobot.id)
                    expect(args[1]).toBe(false)
                    done()
                })
        })
    })
})

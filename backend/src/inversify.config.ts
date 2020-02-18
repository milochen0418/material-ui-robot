import {Container} from 'inversify'
import * as dataAccess from './dataAccess'
import * as businessLogic from './businessLogic'

const appContainer = new Container({
    defaultScope: 'Singleton',
})

appContainer.bind<dataAccess.IMqttClient>(dataAccess.TYPES.MqttClient).to(dataAccess.MqttClient)
appContainer.bind<dataAccess.IMqttImpl>(dataAccess.TYPES.MQTTImpl).to(
    process.env.NODE_ENV === 'testing' ?
        dataAccess.TestMqttWrapper :
        dataAccess.MqttWrapper
)

appContainer.bind<businessLogic.IRobotService>(businessLogic.TYPES.RobotService).to(businessLogic.RobotService)
appContainer.bind<dataAccess.IRobotRepository>(dataAccess.TYPES.RobotRepository).to(dataAccess.RobotMemoryRepository)

appContainer.bind<dataAccess.IRobotAccess>(dataAccess.TYPES.RobotAccess).to(dataAccess.MqttRobotAccess)

export default appContainer

import {combineReducers} from 'redux'

const mockUser = {
    firstName: 'John',
    id: 'da123AEl',
    lastName: 'Smith',
}

const user = (state = mockUser) => state

export default combineReducers({
    user,
})

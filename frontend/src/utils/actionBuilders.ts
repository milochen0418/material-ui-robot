import {AnyAction, ActionCreator} from 'redux'
import {ThunkDispatch, ThunkAction} from 'redux-thunk'
import {Store} from '../types'

export type ActionArgument = string | object | number | [] | null

export const buildAction = (type: string, ...argNames: string[]): ActionCreator<AnyAction> =>
    (...args: ActionArgument[]) => {
        const action = {type} as {type: string, [prop: string]: ActionArgument}
        argNames.forEach((argName, index) => {
            action[argName] = args[index]
        })

        return action
    }

export const buildAsyncAction = (
    params: {
        typeStarted: string,
        typeOnError: string,
        typeOnSuccess: string,
        returnFieldName: string,
        isHttpRequest?: boolean,
    },
    action: (...args: ActionArgument[]) => Promise<ActionArgument>
): ActionCreator<ThunkAction<Promise<AnyAction>, Store, ActionArgument[] | undefined, AnyAction>> =>
    (...args: ActionArgument[]) =>
        async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => Store) => {
            dispatch({type: params.typeStarted})
            try {
                let result = await action(...args, {dispatch, getState})
                if (params.isHttpRequest) {
                    result = await (result as Response).json()
                }

                return dispatch({type: params.typeOnSuccess, [params.returnFieldName]: result})
            } catch (error) {
                return dispatch({type: params.typeOnError, error})
            }
        }

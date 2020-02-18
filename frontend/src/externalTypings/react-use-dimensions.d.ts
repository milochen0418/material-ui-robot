declare module 'react-use-dimensions' {
    export interface DimensionObject {
        width: number
        height: number
        top: number
        left: number
        x: number
        y: number
        right: number
        bottom: number
    }

    export type UseDimensionsHook = [
        // tslint:disable-next-line:no-any
        (node: any) => void,
        DimensionObject,
        HTMLElement
    ]

    export interface UseDimensionsArgs {
        liveMeasure?: boolean
    }
    declare function useDimensions({ liveMeasure }?: UseDimensionsArgs): UseDimensionsHook
    export default useDimensions
}

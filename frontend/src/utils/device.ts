// based on implementation in modernizr lib (MIT licensed)
export function isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.msMaxTouchPoints > 0
}

export function toStdMsgsString(str: string): string {
    return JSON.stringify({ data: str })
}

export function fromStdMsgsString(str: string): string {
    const obj = JSON.parse(str)
    return obj.data
}

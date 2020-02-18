import fs from 'fs'
import path from 'path'

export function getRobotFile(model: string, fileName: string): string {
    const modelSpecificPath = `models/${model}/${fileName}.jpg`
    const existsModelSpecificFile = fs.existsSync(path.resolve(__dirname, `../../public/${modelSpecificPath}`))
    if (existsModelSpecificFile) {
        return `/api/files/${modelSpecificPath}`
    }

    return `/api/files/models/default/${fileName}.jpg`
}

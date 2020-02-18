import {createSelector} from 'reselect'

const prefixesToCheck = ['left_arm/', 'right_arm/', 'center/']

export const getBaseJointName = (joint: string): string => {
    for (const prefix of prefixesToCheck) {
        if (joint.startsWith(prefix)) {
            return joint.substring(prefix.length)
        }
    }

    return joint
}

export const getJointPosition = (joint: string): 'left' | 'center' | 'right' => {
    if (joint.startsWith('left')) {
        return 'left'
    }

    if (joint.startsWith('right')) {
        return 'right'
    }

    return 'center'
}

export const groupJoints = createSelector(
    (joints: string[]) => joints,
    (joints: string[]): string[][] => {
        const groupedJoints: {[jointName: string]: string[]} = {}
        joints.forEach(joint => {
            const baseJointName = getBaseJointName(joint)
            if (!groupedJoints[baseJointName]) {
                groupedJoints[baseJointName] = []
            }

            groupedJoints[baseJointName].push(joint)
        })
        return Object
            .keys(groupedJoints)
            .sort()
            .map(jointName => groupedJoints[jointName].sort((nameA, nameB) => {
                if (nameA.startsWith('left') && !nameB.startsWith('left')) {
                    return -1
                }

                if (nameA.startsWith('right') && !nameB.startsWith('right')) {
                    return 1
                }

                if (nameB.startsWith('right')) {
                    return -1
                }

                if (nameB.startsWith('left')) {
                    return 1
                }

                return 0
            }))
    }
)

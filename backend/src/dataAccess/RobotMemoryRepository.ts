import {injectable} from 'inversify'
import memoryCache, {CacheClass} from 'memory-cache'
import {Robot} from '@entities'
import {IRobotRepository} from './types'

const cache: CacheClass<string, Robot[]> = new memoryCache.Cache()

@injectable()
export class RobotMemoryRepository implements IRobotRepository {
    async getById(siteId: string, robotId: string): Promise<Robot | undefined> {
        return (cache.get(siteId) || []).find(robot => robot.id === robotId)
    }

    async getAll(siteId: string): Promise<Robot[]> {
        return cache.get(siteId) || []
    }

    async add(siteId: string, robot: Robot) {
        const currentRobots = await this.getAll(siteId)
        cache.put(siteId, [...currentRobots.filter(existing => existing.id !== robot.id), robot])
    }

    async update(siteId: string, robot: Robot) {
        const currentRobots = await this.getAll(siteId)
        cache.put(siteId, [...currentRobots.filter(existing => existing.id !== robot.id), robot])
    }

    async clear(siteId: string) {
        cache.del(siteId)
    }
}

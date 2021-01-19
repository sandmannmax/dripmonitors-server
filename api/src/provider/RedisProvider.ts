import { Service } from 'typedi';
import { createNodeRedisClient } from 'handy-redis';

@Service()
export class RedisProvider {
  private Client;

  constructor() {
    this.Client = createNodeRedisClient({ host: 'redis' });
  }

  async GetSetMembers(key): Promise<Array<any>> {
    let members = await this.Client.smembers(key);
    if (members != null)
      return members;
    else
      return [];
  }
  
  async IsSetMember(key, value) {
    return await this.Client.sismember(key, value) == 1;
  }

  async AddSetMember(key, value) {
    await this.Client.sadd(key, value);
  }

  async DeleteSetMember(key, member) {
    await this.Client.srem(key, member);
  }

  async IsSetEmpty(key) {
    return await this.Client.scard(key) == 0;
  }
  
  async GetHashAll(key) {
    return await this.Client.hgetall(key);
  }

  async SetHash(key, values) {
    return await this.Client.hmset(key, values);
  }

  async DeleteHash(key, values) {
    return await this.Client.hdel(key, values);
  }
}
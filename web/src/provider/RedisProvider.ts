import { Service } from 'typedi';
import { createNodeRedisClient } from 'handy-redis';

@Service()
export class RedisProvider {
  private Client;

  constructor() {
    this.Client = createNodeRedisClient({ host: 'redis' });
  }

  async GetSetMembers(key) {
    return await this.Client.smembers(key);
  }
  
  async IsSetMember(key, value) {
    return await this.Client.sismember(key, value) == 1;
  }

  async AddSetMember(key, value) {
    await this.Client.sadd(key, value);
  }

  async DeleteSetMember(key) {
    await this.Client.spop(key);
  }
  
  async GetHashAll(key) {
    return await this.Client.hgetall(key);
  }
}
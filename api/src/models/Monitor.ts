import { Container } from 'typedi';
import { DatabaseProvider } from '../provider/DatabaseProvider';
import { RedisProvider } from '../provider/RedisProvider';
import { Monitor } from '../types/Monitor';
import { MonitoredProduct } from '../types/MonitoredProduct';
import { Product } from '../types/Product';
import { UserJWT } from '../types/User';

const dbProvider = Container.get(DatabaseProvider);
const redisProvider = Container.get(RedisProvider);

export namespace MonitorModel {

  export async function GetMonitor({userId}: {userId: string}): Promise<Array<Monitor>> {
    return await dbProvider.Find<Monitor>('monitors', {userId});
  }

  export async function CreateMonitor({userId}: {userId: string}): Promise<Monitor> {
    await dbProvider.Insert('monitors', {userId, webHook: '', botName: '', botImage: ''});
    let result = await dbProvider.Find<Monitor>('monitors', {userId, webHook: '', botName: '', botImage: ''});
    return result[0];
  }

  export async function UpdateBotImage({userId, botImage}: {userId: string, botImage: string}): Promise<Monitor> {
    await dbProvider.Update('monitors', {userId}, {botImage});
    let result = await dbProvider.Find<Monitor>('monitors', {userId});
    return result[0];
  }

  export async function UpdateBotName({userId, botName}: {userId: string, botName: string}): Promise<Monitor> {
    await dbProvider.Update('monitors', {userId}, {botName});
    let result = await dbProvider.Find<Monitor>('monitors', {userId});
    return result[0];
  }

  export async function UpdateWebhook({userId, webHook}: {userId: string, webHook: string}): Promise<Monitor> {
    await dbProvider.Update('monitors', {userId}, {webHook});
    let result = await dbProvider.Find<Monitor>('monitors', {userId});
    return result[0];
  }
}
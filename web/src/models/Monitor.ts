import { Container } from 'typedi';
import { DatabaseProvider } from '../provider/DatabaseProvider';
import { RedisProvider } from '../provider/RedisProvider';
import { Monitor } from '../types/Monitor';
import { Product } from '../types/Product';

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

  export async function GetProducts(): Promise<Array<Product>> {
    let products: Array<Product> = [];
    let shops = await redisProvider.GetSetMembers('stores');
    for (let i = 0; i < shops.length; i++) {
      let shopProducts = await redisProvider.GetSetMembers(`stores:${shops[i]}:products`);
      for (let j = 0; j < shopProducts.length; j++) {
        let item = await redisProvider.GetHashAll(`stores:${shops[i]}:products:${shopProducts[j]}`);
        let product = new Product();
        product._id = shopProducts[j];
        product.name = item.name;
        product.site = shops[i];
        product.url = item.href;
        product.soldOut = item.soldOut == 'true';
        products.push(product);
      }
    }
    return products;
  }
}
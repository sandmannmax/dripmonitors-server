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

  export async function GetMonitoredItems({userId}): Promise<Array<MonitoredProduct>> {
    let monitoredProducts: Array<MonitoredProduct> = [];
    let monitoredStores = await redisProvider.GetSetMembers(`users:${userId}`);
    if (!monitoredStores)
      return monitoredProducts;

    for (let i = 0; i < monitoredStores.length; i++) {
      let monitoredItems = await redisProvider.GetSetMembers(`users:${userId}:${monitoredStores[i]}`);
      for (let j = 0; j < monitoredItems.length; j++) {        
        let item = await redisProvider.GetHashAll(`users:${userId}:${monitoredStores[i]}:${monitoredItems[j]}`);
        let productItem = await redisProvider.GetHashAll(`stores:${monitoredStores[i]}:products:${monitoredItems[j]}`);
        let monitoredProduct = new MonitoredProduct();
        monitoredProduct._id = monitoredItems[i];
        monitoredProduct.price = Number(item.price);
        let product = new Product();
        product._id = monitoredItems[j];
        product.name = productItem.name;
        product.site = monitoredStores[i];
        product.url = productItem.href;
        product.soldOut = productItem.soldOut == 'true';
        monitoredProduct.product = product;
        monitoredProducts.push(monitoredProduct);
      }
    }
    return monitoredProducts;
  }

  export async function AddMonitoredItem({userId, site, productId, price}: {userId: string, site: string, productId: string, price: number}): Promise<MonitoredProduct> {
    let isUserMonitored = await redisProvider.IsSetMember('users', userId);
    if (!isUserMonitored)
      await redisProvider.AddSetMember('users', userId);

    let isSiteMonitored = await redisProvider.IsSetMember(`users:${userId}`, site);
    if (!isSiteMonitored)
      await redisProvider.AddSetMember(`users:${userId}`, site);

    await redisProvider.AddSetMember(`users:${userId}:${site}`, productId);
    await redisProvider.SetHash(`users:${userId}:${site}:${productId}`, ['price', price]);

    if (!await redisProvider.IsSetMember(`stores:${site}:monitor:products`, productId))
      await redisProvider.AddSetMember(`stores:${site}:monitor:products`, productId)

    let productItem = await redisProvider.GetHashAll(`stores:${site}:products:${productId}`);
    let monitoredProduct = new MonitoredProduct();
    monitoredProduct._id = productId;
    monitoredProduct.price = Number(price);
    let product = new Product();
    product._id = productId;
    product.name = productItem.name;
    product.site = site;
    product.url = productItem.href;
    product.soldOut = productItem.soldOut == 'true';
    monitoredProduct.product = product;
    return monitoredProduct;
  }

  export async function UpdateMonitoredItem({userId, site, productId, price}: {userId: string, site: string, productId: string, price: number}): Promise<MonitoredProduct> {
    await redisProvider.SetHash(`users:${userId}:${site}:${productId}`, ['price', price]);

    let productItem = await redisProvider.GetHashAll(`stores:${site}:products:${productId}`);
    let monitoredProduct = new MonitoredProduct();
    monitoredProduct._id = productId;
    monitoredProduct.price = Number(price);
    let product = new Product();
    product._id = productId;
    product.name = productItem.name;
    product.site = site;
    product.url = productItem.href;
    product.soldOut = productItem.soldOut == 'true';
    monitoredProduct.product = product;
    return monitoredProduct;
  }

  export async function DeleteMonitoredItem({userId, site, productId}: {userId: string, site: string, productId: string}): Promise<void> {
    await redisProvider.DeleteHash(`users:${userId}:${site}:${productId}`, ['price']);
    await redisProvider.DeleteSetMember(`users:${userId}:${site}`, productId);
    if (await redisProvider.IsSetEmpty(`users:${userId}:${site}`))
      await redisProvider.DeleteSetMember(`users:${userId}`, site);
    if (await redisProvider.IsSetEmpty(`users:${userId}`))
      await redisProvider.DeleteSetMember(`users`, userId);

    let stillUsed = false;

    let users = await redisProvider.GetSetMembers('users');
    for (let i = 0; i < users.length; i++) {
      let stores = await redisProvider.GetSetMembers(`users:${users[i]}`);
      if (stores.indexOf(site) > -1) {
        for (let j = 0; j < stores.length; j++){
          let products = await redisProvider.GetSetMembers(`users:${users[i]}:${stores[i]}`);
          if (products.indexOf(productId) > -1) {
            stillUsed = true;
            break;
          }
        }
      }
      if (stillUsed)
        break;
    }

    if (!stillUsed)
      await redisProvider.DeleteSetMember(`stores:${site}:monitor:products`, productId)
  }

  export async function IsProductValid({site, productId}): Promise<boolean> {
    let isValidSite = await redisProvider.IsSetMember('stores', site);
    if (!isValidSite)
      return false;
    let isValidProduct = await redisProvider.IsSetMember(`stores:${site}:products`, productId);
    return isValidProduct;
  }

  export async function IsProductMonitored({userId, site, productId}: {userId: string, site: string, productId: string}): Promise<boolean> {
    let isValidUser = await redisProvider.IsSetMember('users', userId);
    if (!isValidUser)
      return false;

    let isSiteMonitored = await redisProvider.IsSetMember(`users:${userId}`, site);
    if (!isSiteMonitored)
      return false;

    let isProductMonitored = await redisProvider.IsSetMember(`users:${userId}:${site}`, productId);
    return isProductMonitored;
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
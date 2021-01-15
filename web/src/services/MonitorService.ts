import { Service } from 'typedi';
import Container from 'typedi';
import { MonitorModel } from '../models/Monitor';
import { IResult } from '../types/IResult';
import { GetMonitor_O, Monitor } from '../types/Monitor';
import { DiscordService } from './DiscordService';
import { UserJWT } from '../types/User';
import JWT from 'jsonwebtoken';
import { ServiceAccessModel } from '../models/ServiceAccess';
import config from '../config';

@Service()
export class MonitorService {
  private discordService: DiscordService;

  constructor() {
    this.discordService = Container.get(DiscordService);
  }

  async GetMonitor({ user }: { user: UserJWT }): Promise<IResult> {
    try {
      if (!user)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.GetMonitor: User empty`}};
      
      if (!hasMonitorPermission(user))
        return {success: false, error: {status: 403}};      

      let result = await MonitorModel.GetMonitor({ userId: user._id });
      let monitor: Monitor;
      if (result.length == 0){
        return {success: false, error: {status: 404, message: 'Object is not existing.'}};
      } else if (result.length == 1) {
        monitor = result[0];
      } else {
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.GetMonitor: Found more than one monitor for userId = ${user._id}`}};
      }
      return {success: true, data: {monitor: GetMonitor_O(monitor)}};
    } catch (error) {
      return {success: false, error};
    }
  }

  async CreateMonitorAccess({ user, serviceAccessKey }: { user: UserJWT, serviceAccessKey: string }): Promise<IResult> {
    try {
      if (!user)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.CreateMonitor: User empty`}};

      let serviceAccesses = await ServiceAccessModel.FindServiceAccess({ userId: user._id });
    
      if (serviceAccesses.filter(obj => obj.service == 'monitor').length != 0)
        return {success: false, error: {status: 400, message: 'You already own this Service'}};

      if (!serviceAccessKey)
        return {success: false, error: {status: 400, message: '\'serviceAccessKey\' is missing'}};
      
      if (!await ServiceAccessModel.CheckServiceAccessKey({ serviceAccessKey, service: 'monitor' }))
        return {success: false, error: {status: 400, message: '\'serviceAccessKey\' is invalid or already used'}};

      await ServiceAccessModel.UseServiceAccessKey({ serviceAccessKey });

      await ServiceAccessModel.CreateServiceAccess({ userId: user._id, service: 'monitor' });

      serviceAccesses = await ServiceAccessModel.FindServiceAccess({ userId: user._id });
      let services: Array<string> = [];
      for (let i = 0; i < serviceAccesses.length; i++)
        services.push(serviceAccesses[i].service);

      const accessToken = generateToken({_id: user._id, username: user.username, services}, '1h');

      let result = await MonitorModel.GetMonitor({ userId: user._id });
      let monitor: Monitor;
      if (result.length == 1){
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: 'Monitor is already existing.'}};
      } else if (result.length == 0) {
        monitor = await MonitorModel.CreateMonitor({ userId: user._id });
      } else {
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.CreateMonitor: Found more than one monitor for userId = ${user._id}`}};
      }
      return {success: true, data: {monitor: GetMonitor_O(monitor), accessToken}};
    } catch (error) {
      return {success: false, error};
    }
  }

  async UpdateMonitor({ user, webHook, name, imageUrl }: { user: UserJWT, webHook: string, name: string, imageUrl: string }): Promise<IResult> {
    try {
      if (!user)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.UpdateMonitor: User empty`}};

      
      if (!hasMonitorPermission(user))
        return {success: false, error: {status: 403}};     

      let result = await MonitorModel.GetMonitor({ userId: user._id });

      if (result.length == 0)
        return {success: false, error: {status: 404, message: 'Object is not existing.'}};
      
      if (result.length > 1)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.UpdateMonitor: Found more than one monitor for userId = ${user._id}`}};
      
      let monitor = result[0];

      if (webHook)
        monitor = await MonitorModel.UpdateWebhook({ userId: user._id, webHook });

      if (name)
        await MonitorModel.UpdateBotName({ userId: user._id, botName: name });

      if (imageUrl)
        await MonitorModel.UpdateBotImage({ userId: user._id, botImage: imageUrl });

      result = await MonitorModel.GetMonitor({ userId: user._id });
      if (result.length != 1)
        return {success: false, error: {status: 500, message: 'Object is not existing.', internalMessage: `MonitorService.UpdateMonitor: Error after Updating`}};        
      monitor = result[0];
      
      return {success: true, data: {monitor: GetMonitor_O(monitor)}};
    } catch (error) {
      return {success: false, error};
    }
  }

  async SendTestMessage({ user }: { user: UserJWT }): Promise<IResult> {
    try {
      if (!user)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.SendTestMessage: User empty`}};
      
      if (!hasMonitorPermission(user))
        return {success: false, error: {status: 403}};    

      let result = await MonitorModel.GetMonitor({ userId : user._id });

      if (result.length == 0)
        return {success: false, error: {status: 404, message: 'Monitor is not existing.'}};
      
      if (result.length > 1)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.SendTestMessage: Found more than one monitor for userId = ${user._id}`}};
      
      let monitor = result[0];

      if (!monitor.webHook)
        return {success: false, error: {status: 404, message: 'Monitor Webhook is not configured.'}};
        
      return this.discordService.SendTestMessage({webHook: monitor.webHook, botName: monitor.botName, botImage: monitor.botImage});
    } catch (error) {
      return {success: false, error};
    }
  }

  async GetSupportedProducts({ user }: { user: UserJWT }): Promise<IResult> {
    try {
      if (!user)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.GetSupportedProducts: User empty`}};
      
      if (!hasMonitorPermission(user))
        return {success: false, error: {status: 403}};    

      let products = await MonitorModel.GetProducts();
              
      return {success: true, data: { products }};
    } catch (error) {
      return {success: false, error};
    }
  }

  async GetMonitoredItems({ user }: { user: UserJWT }): Promise<IResult> {
    try {
      if (!user)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.GetMonitor: User empty`}};

      
      if (!hasMonitorPermission(user))
        return {success: false, error: {status: 403}};      

      let result = await MonitorModel.GetMonitoredItems({ userId: user._id });

      return {success: true, data: { items: result }};
    } catch (error) {
      return {success: false, error};
    }
  }

  async CreateMonitoredItem({ user, price, productId, site }: { user: UserJWT, price: number, productId: string, site: string }): Promise<IResult> {
    try {
      if (!user)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.GetMonitor: User empty`}};

      
      if (!hasMonitorPermission(user))
        return {success: false, error: {status: 403}}; 
        
      if (!price)
        return {success: false, error: {status: 404, message: '\'price\' missing'}};
        
      if (typeof price != 'number') {
        try {
          price = Number(price);
        } catch {
          return {success: false, error: {status: 404, message: '\'price\' is invalid'}};
        }
      }
        
      if (!productId)
        return {success: false, error: {status: 404, message: '\'productId\' missing'}};
        
      if (!site)
        return {success: false, error: {status: 404, message: '\'site\' missing'}};

      if (!await MonitorModel.IsProductValid({ site, productId }))
        return {success: false, error: {status: 404, message: '\'site\' or \'productId\' is invalid'}};

      if (await MonitorModel.IsProductMonitored({ userId: user._id, site, productId }))
        return {success: false, error: {status: 404, message: 'Product is already monitored'}};

      let result = await MonitorModel.AddMonitoredItem({ userId: user._id, site, productId, price });
      
      return {success: true, data: { item: result }};
    } catch (error) {
      return {success: false, error};
    }
  }

  async UpdateMonitoredItem({ user, price, productId, site }: { user: UserJWT, price: number, productId: string, site: string }): Promise<IResult> {
    try {
      if (!user)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.GetMonitor: User empty`}};

      
      if (!hasMonitorPermission(user))
        return {success: false, error: {status: 403}}; 
        
      if (!price)
        return {success: false, error: {status: 404, message: '\'price\' missing'}};
        
      if (typeof price != 'number')
        return {success: false, error: {status: 404, message: '\'price\' is invalid'}};
        
      if (!site)
        return {success: false, error: {status: 404, message: '\'site\' missing'}};

      if (!await MonitorModel.IsProductValid({ site, productId }))
        return {success: false, error: {status: 404, message: '\'site\' or \'id\' is invalid'}};

      if (!await MonitorModel.IsProductMonitored({ userId: user._id, site, productId }))
        return {success: false, error: {status: 404, message: 'Product is not monitored'}};

      let result = await MonitorModel.UpdateMonitoredItem({ userId: user._id, site, productId, price });
      
      return {success: true, data: { item: result }};
    } catch (error) {
      return {success: false, error};
    }
  }

  async DeleteMonitoredItem({ user, productId, site }: { user: UserJWT, productId: string, site: string }): Promise<IResult> {
    try {
      if (!user)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.GetMonitor: User empty`}};

      
      if (!hasMonitorPermission(user))
        return {success: false, error: {status: 403}}; 
        
      if (!site)
        return {success: false, error: {status: 404, message: '\'site\' missing'}};

      if (!await MonitorModel.IsProductValid({ site, productId }))
        return {success: false, error: {status: 404, message: '\'site\' or \'id\' is invalid'}};

      if (!await MonitorModel.IsProductMonitored({ userId: user._id, site, productId }))
        return {success: false, error: {status: 404, message: 'Product is not monitored'}};

      await MonitorModel.DeleteMonitoredItem({ userId: user._id, site, productId });
      
      return {success: true, data: { message: 'Deleted monitored Item'}};
    } catch (error) {
      return {success: false, error};
    }
  }
}

function generateToken(data, expiration: string) {
  return JWT.sign({data}, config.jwtSecret, { expiresIn: expiration });
}

function hasMonitorPermission(user: UserJWT) {
  if (!user || !user.services)
    return false;
  return user.services.filter(object => object === "monitor").length != 0
}
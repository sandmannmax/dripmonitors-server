import { Service } from 'typedi';
import Container from 'typedi';
import { MonitorModel } from '../models/Monitor';
import { IResult } from '../types/IResult';
import { GetMonitor_O, Monitor } from '../types/Monitor';
import { DiscordService } from './DiscordService';
import { UserJWT } from '../types/User';
import { User } from 'discord.js';
import { Service as ServiceType } from '../types/Service';

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

  async CreateMonitor({ user }: { user: UserJWT }): Promise<IResult> {
    try {
      if (!user)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.CreateMonitor: User empty`}};

      
      if (!hasMonitorPermission(user))
        return {success: false, error: {status: 403}};      

      let result = await MonitorModel.GetMonitor({ userId: user._id });
      let monitor: Monitor;
      if (result.length == 1){
        return {success: false, error: {status: 404, message: 'Object is already existing.'}};
      } else if (result.length == 0) {
        monitor = await MonitorModel.CreateMonitor({ userId: user._id });
      } else {
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.CreateMonitor: Found more than one monitor for userId = ${user._id}`}};
      }
      return {success: true, data: {monitor: GetMonitor_O(monitor)}};
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
}

function hasMonitorPermission(user: UserJWT) {
  return user.services.filter(object => object.name.toLowerCase() === "monitor").length != 0
}
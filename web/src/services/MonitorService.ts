import { Service } from 'typedi';
import Container from 'typedi';
import { MonitorModel } from '../models/Monitor';
import { IResult } from '../types/IResult';
import { GetMonitor_O, Monitor } from '../types/Monitor';
import { DiscordService } from './DiscordService';

@Service()
export class MonitorService {
  private discordService: DiscordService;

  constructor() {
    this.discordService = Container.get(DiscordService);
  }

  async GetMonitor({userId}): Promise<IResult> {
    try {
      if (userId){
        let result = await MonitorModel.GetMonitor({userId});
        let monitor: Monitor;
        if (result.length == 0){
          monitor = await MonitorModel.CreateMonitor({userId});
        } else if (result.length == 1) {
          monitor = result[0];
        } else {
          return {success: false, error: {status: 500, message: 'Can\'t find Monitor'}}
        }
        return {success: true, data: {monitor: GetMonitor_O(monitor)}};
      } else
        return {success: false, error: {status: 401, message: 'UserID Missing'}};      
    } catch (error) {
      return {success: false, error};
    }
  }

  async UpdateBotImage({userId, botImage}): Promise<IResult> {
    try {
      if (userId && botImage) {
        let result = await MonitorModel.GetMonitor({userId});
        if (result.length == 1) {
          let monitor = await MonitorModel.UpdateBotImage({userId, botImage});
          return {success: true, data: {monitor: GetMonitor_O(monitor)}};
        } else      
          return {success: false, error: {status: 404, message: 'Can\'t find Monitor'}}
      } else
        return {success: false, error: {status: 404, message: 'botImage Missing'}};  
    } catch (error) {
      return {success: false, error};
    }
  }

  async UpdateBotName({userId, botName}): Promise<IResult> {
    try {
      if (userId && botName) {
        let result = await MonitorModel.GetMonitor({userId});
        if (result.length == 1) {
          let monitor = await MonitorModel.UpdateBotName({userId, botName});
          return {success: true, data: {monitor: GetMonitor_O(monitor)}};
        } else      
          return {success: false, error: {status: 404, message: 'Can\'t find Monitor'}}
      } else
        return {success: false, error: {status: 404, message: 'botName Missing'}};  
    } catch (error) {
      return {success: false, error};
    }
  }

  async UpdateWebhook({userId, webHook}: {userId: string, webHook: string}): Promise<IResult> {
    try {
      if (userId && webHook) {
        if (webHook.match('https:\/\/discord.com\/api\/webhooks\/([^\/]+)\/([^\/]+)')) {
          let result = await MonitorModel.GetMonitor({userId});
          if (result.length == 1) {
            let monitor = await MonitorModel.UpdateWebhook({userId, webHook});
            return {success: true, data: {monitor: GetMonitor_O(monitor)}};
          } else      
            return {success: false, error: {status: 404, message: 'Can\'t find Monitor'}}
        } else      
          return {success: false, error: {status: 404, message: 'No Valid Webhook'}}
      } else
        return {success: false, error: {status: 404, message: 'webHook Missing'}};  
    } catch (error) {
      return {success: false, error};
    }
  }

  async TestMessage({userId}): Promise<IResult> {
    try {
      if (userId) {
        let result = await MonitorModel.GetMonitor({userId});
        if (result.length == 1) {
          let monitor = result[0];
          if (monitor.webHook)
            return this.discordService.SendTestMessage({webHook: monitor.webHook, botName: monitor.botName, botImage: monitor.botImage});
          else
            return {success: false, error: {status: 404, message: 'Webhook for this Monitor isn\'t configured'}}
        } else      
          return {success: false, error: {status: 404, message: 'Can\'t find Monitor'}}
      } else
        return {success: false, error: {status: 404, message: 'webHook Missing'}};  
    } catch (error) {
      return {success: false, error};
    }
  
  
  }
}
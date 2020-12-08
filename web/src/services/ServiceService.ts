import { Service } from 'typedi';
import Container from 'typedi';
import { MonitorModel } from '../models/Monitor';
import { IResult } from '../types/IResult';
import { GetMonitor_O, Monitor } from '../types/Monitor';
import { DiscordService } from './DiscordService';
import { UserJWT } from '../types/User';
import { User } from 'discord.js';
import { Service as ServiceType } from '../types/Service';
import { ServiceModel } from '../models/Service';
import { ServiceAccessModel } from '../models/ServiceAccess';

@Service()
export class ServiceService {

  async Get(): Promise<IResult> {
    try {
      let services = await ServiceModel.GetServices();
      return {success: true, data: services};
    } catch (error) {
      return {success: false, error};
    }
  }

  async Buy({ user, id }: { user: UserJWT, id: string }): Promise<IResult> {
    try {
      if (!user)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `MonitorService.CreateMonitor: User empty`}};

      
      let serviceAccesses = await ServiceAccessModel.FindServiceAccess({ userId: user._id });
      
      if (serviceAccesses.filter(obj => obj._id == id).length != 0)
        return {success: false, error: {status: 400, message: 'You already own this Service'}};


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
}
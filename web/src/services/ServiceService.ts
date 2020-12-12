import { Service } from 'typedi';
import { IResult } from '../types/IResult';
import { UserJWT } from '../types/User';
import { Service as ServiceType } from '../types/Service';
import { ServiceModel } from '../models/Service';
import { ServiceAccessModel } from '../models/ServiceAccess';
import JWT from 'jsonwebtoken';
import config from '../config';

@Service()
export class ServiceService {

  async Get(): Promise<IResult> {
    try {
      let services = await ServiceModel.GetServices();
      return {success: true, data: { services }};
    } catch (error) {
      return {success: false, error};
    }
  }

  async Buy({ user, id, serviceAccessKey }: { user: UserJWT, id: string, serviceAccessKey: string }): Promise<IResult> {
    try {
      if (!user)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `ServiceService.Buy: User empty`}};
      
      let serviceAccesses = await ServiceAccessModel.FindServiceAccess({ userId: user._id });
      
      if (serviceAccesses.filter(obj => obj.serviceId == id).length != 0)
        return {success: false, error: {status: 400, message: 'You already own this Service'}};

      if (!await ServiceAccessModel.CheckServiceAccessKey({ serviceAccessKey }))
        return {success: false, error: {status: 400, message: '\'serviceAccessKey\' is invalid or already used'}};

      await ServiceAccessModel.UseServiceAccessKey({ serviceAccessKey });

      await ServiceAccessModel.CreateServiceAccess({ userId: user._id, serviceId: id });

      serviceAccesses = await ServiceAccessModel.FindServiceAccess({ userId: user._id });
      let services: Array<ServiceType> = [];
      for (let i = 0; i < serviceAccesses.length; i++)
        services.push(await ServiceModel.FindService({ _id: serviceAccesses[i].serviceId }));

      const accessToken = this.generateToken({_id: user._id, username: user.username, services}, '1h');
      return {success: true, data: { accessToken }};
    } catch (error) {
      return {success: false, error};
    }
  }

  private generateToken(data, expiration: string) {
    return JWT.sign({data}, config.jwtSecret, { expiresIn: expiration });
  }
}
import { Service } from 'typedi';
import { sha3_512 } from 'js-sha3'
import { IResult } from '../types/IResult';
import { UserModel } from '../models/User';
import JWT from 'jsonwebtoken';
import config from '../config';
import { GetUser_O } from '../types/User';
import { ServiceAccessModel } from '../models/ServiceAccess';
import { ServiceModel } from '../models/Service';
import { Service as ServiceType } from '../types/Service';
import { async } from 'crypto-random-string';
import { RefreshTokenModel } from '../models/RefreshToken';

@Service()
export class AuthService {
  async Login({username, password}: {username: string, password: string}): Promise<IResult> {
    try {
      if (username && password) {
        let user = await UserModel.FindUserByUsername({username});
        if (user) {          
          password = sha3_512(password + user.salt + config.pepper);
          if (user.password == password) {
            await UserModel.SetValidSession({_id: user._id});

            let serviceAccesses = await ServiceAccessModel.FindServiceAccess({ userId: user._id });
            let services: Array<ServiceType>;      
            for (let i = 0; i < serviceAccesses.length; i++)
              services.push(await ServiceModel.FindService({ _id: serviceAccesses[i].serviceId }));

            const accessToken = this.generateToken({_id: user._id, username: user.username, services}, '1h');
            let refreshToken: string;
            do {
              refreshToken = await async({length: 30});
            } while (await RefreshTokenModel.CheckDuplicate({ _id: refreshToken }));
            await RefreshTokenModel.Insert({_id: refreshToken, userId: user._id});
            return {success: true, data: {user: GetUser_O(user), accessToken, refreshToken}};
          } else
            return {success: false, error: {status: 401, message: 'Username or Password Wrong'}};
        } else
          return {success: false, error: {status: 401, message: 'Username or Password Wrong'}};
      } else
        return {success: false, error: {status: 404, message: 'Username or Password Missing'}};
    } catch (error) {
      return {success: false, error};
    }    
  }

  async Logout({_id}: {_id: string}): Promise<IResult> {
    try {
      if (_id) {
        await UserModel.SetInvalidSession({_id});
        return {success: true, data: {message: 'Logged out successfully'}};
      } else
        return {success: false, data: {message: 'User Invalid'}};
    } catch (error) {
      return {success: false, error};
    }    
  }

  async Refresh({refreshToken}: {refreshToken: string}): Promise<IResult> {
    try {
      if (!refreshToken)
        return {success: false, error: {status: 400, message: '\'refreshToken\' missing'}};

      const rt = await RefreshTokenModel.Find({ _id: refreshToken });
      const now = Number((Date.now()/1000).toString().split('.')[0]);

      if (!rt)
        return {success: false, error: {status: 400, message: '\'refreshToken\' invalid'}};

      if (Number(rt.timestamp) + (60 * 60 * 24) < now)
        return {success: false, error: {status: 400, message: '\'refreshToken\' expired'}};

      const user = await UserModel.FindUser({ _id: rt.userId });

      if (!user || !user.hasValidSession)
        return {success: false, error: {status: 400, message: '\'refreshToken\' invalid'}};

      let serviceAccesses = await ServiceAccessModel.FindServiceAccess({ userId: user._id });
      let services: Array<ServiceType>;      
      for (let i = 0; i < serviceAccesses.length; i++)
        services.push(await ServiceModel.FindService({ _id: serviceAccesses[i].serviceId }));

      const accessToken = this.generateToken({_id: user._id, username: user.username, services}, '1h');

      return {success: true, data: {accessToken}};
    } catch (error) {
      return {success: false, error};
    }    
  }

  private generateToken(data, expiration: string) {
    return JWT.sign({data}, config.jwtSecret, { expiresIn: expiration });
  }
}
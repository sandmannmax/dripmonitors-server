import { Service } from 'typedi';
import { sha3_512 } from 'js-sha3'
import { IResult } from '../types/IResult';
import { Service as ServiceType } from '../types/Service';
import { UserModel } from '../models/User';
import JWT from 'jsonwebtoken';
import config from '../config';
import { async } from 'crypto-random-string';
import { GetUser_O } from '../types/User';
import { RefreshTokenModel } from '../models/RefreshToken';
import { ServiceAccessModel } from '../models/ServiceAccess';
import { ServiceModel } from '../models/Service';

@Service()
export class UserService {
  async Get({_id}: {_id: string}): Promise<IResult> {
    try {
      if (_id) {
        let user = await UserModel.FindUser({_id});
        if (user) {
          return {success: true, data: {user: GetUser_O(user)}};
        } else
          return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `UserService.Get: User not found in DB. _id: ${_id}`}};
      } else
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `UserService.Get: _id empty.`}};
    } catch (error) {
      return {success: false, error};
    }    
  }

  async Register({username, mail, password}: {username: string, mail: string, password: string}): Promise<IResult> {
    try {
      if (username && mail && password) {
        let isUsernameUnused = await UserModel.IsUsernameUnused({username});
        let isMailUnused = await UserModel.IsMailUnused({mail});
        if (isUsernameUnused) {
          if (isMailUnused) {
            let newSalt = await async({length: 20});
            password = sha3_512(password + newSalt + config.pepper);
            let result = await UserModel.CreateUser({username, mail, password, salt: newSalt});
            await UserModel.SetValidSession({_id: result[0]._id});
            const accessToken = this.generateToken({_id: result[0]._id, username: result[0].username, services: []}, '1h');
            let refreshToken: string;
            do {
              refreshToken = await async({length: 30});
            } while (await RefreshTokenModel.CheckDuplicate({ _id: refreshToken }))
            await RefreshTokenModel.Insert({_id: refreshToken, userId: result[0]._id});
            return {success: true, data: {user: GetUser_O(result[0]), accessToken, refreshToken}};
          } else
            return {success: false, error: {status: 404, message: 'Mail already in use'}};
        } else
          return {success: false, error: {status: 404, message: 'Username already in use'}};
      } else
        return {success: false, error: {status: 404, message: 'Username, Password or Mail Missing'}};
    } catch (error) {
      return {success: false, error};
    }    
  }

  async Update({_id, username, mail, password, oldPassword}: {_id: string, username: string, mail: string, password: string, oldPassword: string}): Promise<IResult> {
    try {
      if (!_id)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `UserService.Update: _id empty.`}};
      
      if (!oldPassword)
        return {success: false, error: {status: 404, message: '\'oldPassword\' missing'}};

      let user = await UserModel.FindUser({_id});
      if (!user)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `UserService.Update: User missing.`}};

      if (user.password != sha3_512(oldPassword + user.salt + config.pepper)) 
        return {success: false, error: {status: 401, message: '\'oldPassword\' wrong'}};

      if (username) {
        await UserModel.UpdateUsername({_id, username});
        await UserModel.SetInvalidSession({_id});
      }       

      if (mail) {
        await UserModel.UpdateMail({_id, mail});
        await UserModel.SetInvalidSession({_id});
      }       

      if (password) {
        await UserModel.UpdatePassword({_id, password});
        await UserModel.SetInvalidSession({_id});
      }       

      user = await UserModel.FindUser({_id});
      if (!user)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `UserService.Update: User missing after change.`}};
      
      return {success: true, data: {user: GetUser_O(user)}};
    } catch (error) {
      return {success: false, error};
    }    
  }

  async Delete({_id}: {_id: string}): Promise<IResult> {
    try {
      if (_id) {
        let result = await UserModel.FindUser({_id});
        if (result) {          
          await UserModel.DeleteUser({_id});
          return {success: true, data: {message: 'Successfully Deleted'}};
        } else
          return {success: false, error: {status: 404, message: 'Can\'t find user'}};
      } else
        return {success: false, error: {status: 404, message: 'ID Missing'}};
    } catch (error) {
      return {success: false, error};
    }    
  }

  async UpdateUsername({_id, username}: {_id: string, username: string}): Promise<IResult> {
    try {
      if (_id && username) {
        let result = await UserModel.UpdateUsername({_id, username});
        if (result) {
          await UserModel.SetInvalidSession({_id});
          return {success: true, data: {user: GetUser_O(result)}};
        } else
          return {success: false, error: {status: 404, message: 'Can\'t find user'}};
      } else
        return {success: false, error: {status: 404, message: 'ID or Username Missing'}};
    } catch (error) {
      return {success: false, error};
    }    
  }

  async UpdateMail({_id, mail}: {_id: string, mail: string}): Promise<IResult> {
    try {
      if (_id && mail) {
        let result = await UserModel.UpdateMail({_id, mail});
        if (result) {
          await UserModel.SetInvalidSession({_id});
          return {success: true, data: {user: GetUser_O(result)}};
        } else
          return {success: false, error: {status: 404, message: 'Can\'t find user'}};
      } else
        return {success: false, error: {status: 404, message: 'ID or Mail Missing'}};
    } catch (error) {
      return {success: false, error};
    }    
  }

  async UpdatePassword({_id, password}: {_id: string, password: string}): Promise<IResult> {
    try {
      if (_id && password) {
        let user = await UserModel.FindUser({_id});
        if (user) {
          password = sha3_512(password + user.salt + config.pepper);
          let result = await UserModel.UpdatePassword({_id, password});
          await UserModel.SetInvalidSession({_id});
          return {success: true, data: {user: GetUser_O(result)}};
        } else
          return {success: false, error: {status: 404, message: 'Can\'t find user'}};
      } else
        return {success: false, error: {status: 404, message: 'ID or Password Missing'}};
    } catch (error) {
      return {success: false, error};
    }    
  }

  async GetServices({_id}: {_id: string}): Promise<IResult> {
    try {
      if (!_id)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `UserService.Get: _id empty.`}}; 

      let user = await UserModel.FindUser({_id});
      if (!user)
        return {success: false, error: {status: 500, message: 'Unexpected Server Error', internalMessage: `UserService.Get: User not found in DB. _id: ${_id}`}}; 
       
      let serviceAccesses = await ServiceAccessModel.FindServiceAccess({ userId: user._id });

      let services: Array<ServiceType>;

      for (let i = 0; i < serviceAccesses.length; i++)
        services.push(await ServiceModel.FindService({ _id: serviceAccesses[i].serviceId }));

      return {success: true, data: services};
    } catch (error) {
      return {success: false, error};
    }    
  }

  private generateToken(data, expiration: string) {
    return JWT.sign({data}, config.jwtSecret, { expiresIn: expiration });
  }
}
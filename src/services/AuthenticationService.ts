import { Service } from 'typedi';
import { sha3_512 } from 'js-sha3'
import { IResult } from '../types/IResult';
import { UserModel } from '../models/User';
import JWT from 'jsonwebtoken';
import config from '../config';
import { async } from 'crypto-random-string';

@Service()
export class AuthenticationService {
  async Login({username, password}: {username: string, password: string}): Promise<IResult> {
    try {
      if (username && password) {
        let user = await UserModel.FindUserByUsername({username});
        password = sha3_512(password + user.salt + config.pepper);
        let result = await UserModel.LoginUser({username, password});
        if (result.length == 1) {
          const accessToken = this.generateToken({_id: result[0]._id, username: result[0].username}, '1h');
          const refreshToken = this.generateToken({_id: result[0]._id, username: result[0].username, refresh: true}, '24h');
          return {success: true, data: {username: result[0].username, accessToken, refreshToken}};
        } else
          return {success: false, error: {status: 401, message: 'Username or Password Wrong'}};
      } else
        return {success: false, error: {status: 404, message: 'Username or Password Missing'}};
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
            const accessToken = this.generateToken({_id: result[0]._id, username: result[0].username}, '1h');
            const refreshToken = this.generateToken({_id: result[0]._id, username: result[0].username, refresh: true}, '24h');
            return {success: true, data: {username: result[0].username, accessToken, refreshToken}};
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

  async Refresh({refreshToken}: {refreshToken: string}): Promise<IResult> {
    try {
      if (refreshToken) {
        const decoded = JWT.verify(refreshToken, config.jwtSecret);
        console.log(decoded);
        if (decoded && decoded.data.refresh)
        {
          const accessToken = this.generateToken({_id: decoded.data._id, username: decoded.data.username}, '1h');
          return {success: true, data: {accessToken}};
        } else
          return {success: false, error: {status: 404, message: 'Refresh Token Invalid'}};
      } else
        return {success: false, error: {status: 404, message: 'Refresh Token Missing'}};
    } catch (error) {
      return {success: false, error};
    }    
  }

  private generateToken(data, expiration: string) {
    return JWT.sign({data}, config.jwtSecret, { expiresIn: expiration });
  }
}
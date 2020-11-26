import { Service } from 'typedi';
import { sha3_512 } from 'js-sha3'
import { IResult } from '../types/IResult';
import { UserModel } from '../models/User';
import JWT from 'jsonwebtoken';
import config from '../config';

@Service()
export class AuthenticationService {
  async Login({username, password}: {username: string, password: string}): Promise<IResult> {
    try {
      if (username && password) {
        password = sha3_512(password);
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
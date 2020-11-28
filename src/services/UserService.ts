import { Service } from 'typedi';
import { sha3_512 } from 'js-sha3'
import { IResult } from '../types/IResult';
import { UserModel } from '../models/User';
import JWT from 'jsonwebtoken';
import config from '../config';
import { async } from 'crypto-random-string';
import { GetUser_O } from '../types/User';

@Service()
export class UserService {
  async Login({username, password}: {username: string, password: string}): Promise<IResult> {
    try {
      if (username && password) {
        let user = await UserModel.FindUserByUsername({username});
        if (user) {          
          password = sha3_512(password + user.salt + config.pepper);
          if (user.password == password) {
            await UserModel.SetValidSession({_id: user._id});
            const accessToken = this.generateToken({_id: user._id, username: user.username}, '1h');
            const refreshToken = this.generateToken({_id: user._id, username: user.username, refresh: true}, '24h');
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
            const accessToken = this.generateToken({_id: result[0]._id, username: result[0].username}, '1h');
            const refreshToken = this.generateToken({_id: result[0]._id, username: result[0].username, refresh: true}, '24h');
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

  private generateToken(data, expiration: string) {
    return JWT.sign({data}, config.jwtSecret, { expiresIn: expiration });
  }
}
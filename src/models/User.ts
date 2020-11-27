import { Container } from 'typedi';
import { DatabaseProvider } from '../provider/DatabaseProvider';
import { User } from '../types/User';

const dbProvider = Container.get(DatabaseProvider);

export namespace UserModel {
  export async function LoginUser({username, password}: {username: string, password: string}): Promise<Array<User>> {
    let result = await dbProvider.Find<User>('users', {username, password});
    if (result.length == 1)
      await dbProvider.Update('users', {_id: result[0]._id}, {hasValidSession: true});
    return result;
  }

  export async function CreateUser({username, mail, password, salt}: {username: string, mail: string, password: string, salt: string}): Promise<Array<User>> {
    await dbProvider.Insert('users', {username, mail, password, salt, hasValidSession: false});
    let result = await dbProvider.Find<User>('users', {username, mail, password, salt});
    return result;
  }

  export async function UpdateUsername({_id, username}: {_id: string, username: string}): Promise<User> {
    await dbProvider.Update('users', {_id}, {username});
    let result = await dbProvider.Find<User>('users', {_id});
    return result[0];
  }

  export async function UpdateMail({_id, mail}: {_id: string, mail: string}): Promise<User> {
    await dbProvider.Update('users', {_id}, {mail});
    let result = await dbProvider.Find<User>('users', {_id});
    return result[0];
  }

  export async function UpdatePassword({_id, password}: {_id: string, password: string}): Promise<User> {
    await dbProvider.Update('users', {_id}, {password});
    let result = await dbProvider.Find<User>('users', {_id});
    return result[0];
  }

  export async function FindUser({_id}: {_id: string}): Promise<User> {
    let result = await dbProvider.Find<User>('users', {_id});
    return result[0];
  }

  export async function FindUserByUsername({username}: {username: string}): Promise<User> {
    let result = await dbProvider.Find<User>('users', {username});
    return result[0];
  }

  export async function DeleteUser({_id}: {_id: string}): Promise<void> {
    await dbProvider.Delete('users', {_id});
  }

  export async function IsUsernameUnused({username}: {username: string}): Promise<boolean> {
    let result = await dbProvider.Find<User>('users', {username});
    return result.length == 0;
  }

  export async function IsMailUnused({mail}: {mail: string}): Promise<boolean> {
    let result = await dbProvider.Find<User>('users', {mail});
    return result.length == 0;
  }
}
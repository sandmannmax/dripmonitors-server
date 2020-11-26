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

  export async function FindUser({_id}: {_id: string}): Promise<User> {
    let result = await dbProvider.Find<User>('users', {_id});
    return result[0];
  }
}
import { Container } from 'typedi';
import { DatabaseProvider } from '../provider/DatabaseProvider';
import { Service } from '../types/Service';

const dbProvider = Container.get(DatabaseProvider);

export namespace ServiceModel {

  export async function FindService({ _id }: {_id: string}): Promise<Service> {
    let result = await dbProvider.Find<Service>('services', { _id });
    if (result.length == 0)
      return result[0];
    else
      return undefined;
  }
}
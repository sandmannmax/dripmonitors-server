import { Container } from 'typedi';
import { DatabaseProvider } from '../provider/DatabaseProvider';
import { ServiceAccess } from '../types/ServiceAccess';

const dbProvider = Container.get(DatabaseProvider);

export namespace ServiceAccessModel {

  export async function FindServiceAccess({userId, serviceName}: {userId: string, serviceName: string}): Promise<Array<ServiceAccess>> {
    return await dbProvider.Find<ServiceAccess>('service_access', {userId, serviceName});
  }
}
import { Container } from 'typedi';
import { DatabaseProvider } from '../provider/DatabaseProvider';
import { ServiceAccess } from '../types/ServiceAccess';
import { ServiceAccessKey } from '../types/ServiceAccessKey';

const dbProvider = Container.get(DatabaseProvider);

export namespace ServiceAccessModel {

  export async function FindServiceAccess({ userId }: {userId: string}): Promise<Array<ServiceAccess>> {
    return await dbProvider.Find<ServiceAccess>('service_access', { userId });
  }

  export async function CreateServiceAccess({ userId, service }: {userId: string, service: string}): Promise<void> {
    await dbProvider.Insert('service_access', { userId, service });
  }

  export async function CheckServiceAccessKey({ serviceAccessKey, service }: {serviceAccessKey: string, service: string}): Promise<boolean> {
    return (await dbProvider.Find<ServiceAccessKey>('service_access_keys', { key: serviceAccessKey, used: false, service })).length != 0;
  }

  export async function UseServiceAccessKey({ serviceAccessKey }: {serviceAccessKey: string}): Promise<void> {
    await dbProvider.Update('service_access_keys', { key: serviceAccessKey }, {used: true});
  }
}
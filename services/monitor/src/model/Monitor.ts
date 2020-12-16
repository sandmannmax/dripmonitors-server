import { DatabaseProvider } from '../provider/DatabaseProvider';
import { Monitor } from '../types/Monitor';

export class MonitorModel {
  private dbProvider: DatabaseProvider;

  constructor(provider: DatabaseProvider) {
    this.dbProvider = provider;
  }

  async GetMonitor({userId}: {userId: string}): Promise<Array<Monitor>> {
    return await this.dbProvider.Find<Monitor>('monitors', {userId});
  }
}
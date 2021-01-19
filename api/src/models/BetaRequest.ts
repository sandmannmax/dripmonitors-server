import { Container } from 'typedi';
import { DatabaseProvider } from '../provider/DatabaseProvider';
import { BetaRequest } from '../types/BetaRequest';

const dbProvider = Container.get(DatabaseProvider);

export namespace BetaRequestModel {

  export async function GetBetaRequest({ email }: { email: string }): Promise<Array<BetaRequest>> {
    return await dbProvider.Find<BetaRequest>('betaRequests', { email });
  }

  export async function CreateBetaRequest({ email }: { email: string }): Promise<BetaRequest> {
    let now = Date.now();
    await dbProvider.Insert('betaRequests', { email, date: now });
    let result = await dbProvider.Find<BetaRequest>('betaRequests', { email, date: now });
    return result[0];
  }
}
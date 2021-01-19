export class BetaRequest_O {
  public email: string;
}

export class BetaRequest {
  public _id: string;
  public email: string;
  public date: Date;
}

export function GetBetaRequest_O(betaRequest: BetaRequest): BetaRequest_O {
  let betaRequestO: BetaRequest_O = new BetaRequest_O();
  betaRequestO.email = betaRequest.email;
  return betaRequestO;
}
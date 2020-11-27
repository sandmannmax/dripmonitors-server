export class User_O {
  public username: string;
}

export class User {
  public _id: string;
  public username: string;
  public mail: string;
  public password: string;
  public salt: string;
  public hasValidSession: boolean;
}
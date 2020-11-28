export class User_O {
  public _id: string;
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

export function GetUser_O(user: User): User_O {
  let userO: User_O = new User_O();
    userO._id = user._id;
    userO.username = user.username;
    return userO;
}
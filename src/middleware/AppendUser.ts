import { UserModel } from '../models/User';

export default async (req, res, next) => {
  const decodedTokenData = req.token;
  const userRecord = await UserModel.FindUser({ _id: decodedTokenData.data._id})
 
  req.user = userRecord;
 
  if(!userRecord) {
    return next({status: 401, message: 'User Invalid'});
  } else if (userRecord.hasValidSession) {
    return next();
  } else {
    return next({status: 401, message: 'Session Invalid'});
  }
 }
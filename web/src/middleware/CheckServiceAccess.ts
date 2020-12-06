import { ServiceAccessModel } from '../models/ServiceAccess';
import { ServiceAccess } from '../types/ServiceAccess';
import { User } from '../types/User';

export default async (req, res, next) => {
  const serviceName: string = req.serviceName;
  const user: User = req.user;
  const serviceAccess: Array<ServiceAccess> = await ServiceAccessModel.FindServiceAccess({userId: `${user._id}`, serviceName})

  if (serviceAccess.length > 0)
    return next();
  else 
    return next({status: 403, message: 'No Access to this Service'});
 }
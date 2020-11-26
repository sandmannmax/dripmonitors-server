import JWT from 'jsonwebtoken';
import config from '../config';

const getTokenFromHeader = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
}

export function IsAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    const decoded = JWT.verify(token, config.jwtSecret);
    console.log(decoded);
    if (decoded && !decoded.data.refresh) {
      req['token'] = decoded;
      next();
    } else
      next({status: 401, message: 'Invalid Token'});
  } catch (error) {
    next(error);
  }
};
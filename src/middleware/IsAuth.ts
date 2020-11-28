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
    if (token) {
      const decoded = JWT.verify(token, config.jwtSecret);
      if (decoded && !decoded.data.refresh) {
        req['token'] = decoded;
        next();
      } else
        next({status: 401, message: 'Invalid Token'});
    } else
      next({status: 404, message: 'Token Missing'});
  } catch (error) {
    next(error);
  }
};
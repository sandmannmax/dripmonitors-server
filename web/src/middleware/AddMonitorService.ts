

export default async (req, res, next) => {
  req.serviceName = 'monitor';
  return next();
 }
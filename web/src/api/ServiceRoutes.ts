import { Router } from 'express';
import Container from 'typedi';
import { IError } from '../types/IError';
import { IsAuth } from '../middleware/IsAuth';
import { ServiceService } from '../services/ServiceService';
import { UserJWT } from '../types/User';

export class ServiceRoutes {
  private router: Router;
  private serviceService: ServiceService;

  constructor() {
    this.router = Router({strict: true});
    this.serviceService = Container.get(ServiceService);

    this.router.get('/', async (req, res, next) => {
      let result = await this.serviceService.Get();
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });
    
    this.router.post('/:id/buy', IsAuth, async (req, res, next) => {
      let user: UserJWT = req['user'];
      let id = req.params.id;
      let { serviceAccessKey } = req.body;
      let result = await this.serviceService.Buy({ user, id, serviceAccessKey });
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });
  }

  public GetRouter(): Router {
    return this.router;
  }
}
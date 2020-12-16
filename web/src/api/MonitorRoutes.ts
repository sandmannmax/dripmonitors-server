import { Router } from 'express';
import Container from 'typedi';
import { IError } from '../types/IError';
import { IsAuth } from '../middleware/IsAuth';
import { MonitorService } from '../services/MonitorService';
import { UserJWT } from '../types/User';

export class MonitorRoutes {
  private router: Router;
  private monitorService: MonitorService;

  constructor() {
    this.router = Router({strict: true});
    this.monitorService = Container.get(MonitorService);

    this.router.get('/', IsAuth, async (req, res, next) => {
      let user: UserJWT = req['user'];
      let result = await this.monitorService.GetMonitor({ user });
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });
    
    this.router.post('/', IsAuth, async (req, res, next) => {
      let user: UserJWT = req['user'];
      let { serviceAccessKey } = req.body;
      let result = await this.monitorService.CreateMonitorAccess({ user, serviceAccessKey });
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });
    
    this.router.patch('/', IsAuth, async (req, res, next) => {
      let user: UserJWT = req['user'];
      let { webHook, name, imageUrl } = req.body;
      let result = await this.monitorService.UpdateMonitor({ user, webHook, name, imageUrl });
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });

    this.router.post('/testmessage', IsAuth, async (req, res, next) => {
      let user: UserJWT = req['user'];
      let result = await this.monitorService.SendTestMessage({ user });
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });

    this.router.get('/items', IsAuth, async (req, res, next) => {
      let user: UserJWT = req['user'];
      let result = await this.monitorService.GetMonitoredItems({ user });
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });

    this.router.post('/items', IsAuth, async (req, res, next) => {
      let user: UserJWT = req['user'];
      let { price, productId, site } = req.body;
      let result = await this.monitorService.CreateMonitoredItem({ user, price, productId, site });
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });

    this.router.patch('/items/:id', IsAuth, async (req, res, next) => {
      let user: UserJWT = req['user'];
      let productId = req.params.id;
      let { price, site } = req.body;
      let result = await this.monitorService.UpdateMonitoredItem({ user, price, productId, site });
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });

    this.router.delete('/items/:id', IsAuth, async (req, res, next) => {
      let user: UserJWT = req['user'];
      let productId = req.params.id;
      let { site } = req.body;
      let result = await this.monitorService.DeleteMonitoredItem({ user, productId, site });
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });
  
    this.router.get('/products', IsAuth, async (req, res, next) => {
      let user: UserJWT = req['user'];
      let result = await this.monitorService.GetSupportedProducts({ user });
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
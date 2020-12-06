import { Router } from 'express';
import Container from 'typedi';
import { IError } from '../types/IError';
import { IsAuth } from '../middleware/IsAuth';
import AppendUser from '../middleware/AppendUser';
import { MonitorService } from '../services/MonitorService';
import AddMonitorService from '../middleware/AddMonitorService';
import CheckServiceAccess from '../middleware/CheckServiceAccess';
import { User } from '../types/User';

export class MonitorRoutes {
  private router: Router;
  private monitorService: MonitorService;

  constructor() {
    this.router = Router({strict: true});
    this.monitorService = Container.get(MonitorService);

    this.router.get('/', IsAuth, AppendUser, AddMonitorService, CheckServiceAccess, async (req, res, next) => {
      let user: User = req['user'];
      let userId = user._id;
      let result = await this.monitorService.GetMonitor({userId});
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });

    this.router.get('/sendtestmessage', IsAuth, AppendUser, AddMonitorService, CheckServiceAccess, async (req, res, next) => {
      let user: User = req['user'];
      let userId = user._id;
      let result = await this.monitorService.TestMessage({userId});
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });

    this.router.get('/update/botname', IsAuth, AppendUser, AddMonitorService, CheckServiceAccess, async (req, res, next) => {
      let user: User = req['user'];
      let userId = user._id;
      let { botName } = req.body;  
      let result = await this.monitorService.UpdateBotName({userId, botName});
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });

    this.router.get('/update/botimage', IsAuth, AppendUser, AddMonitorService, CheckServiceAccess, async (req, res, next) => {
      let user: User = req['user'];
      let userId = user._id;
      let { botImage } = req.body;  
      let result = await this.monitorService.UpdateBotImage({userId, botImage});
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });

    this.router.get('/update/webhook', IsAuth, AppendUser, AddMonitorService, CheckServiceAccess, async (req, res, next) => {
      let user: User = req['user'];
      let userId = user._id;
      let { webHook } = req.body;  
      let result = await this.monitorService.UpdateWebhook({userId, webHook});
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
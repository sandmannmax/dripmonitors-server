import { Router } from 'express';
import Container from 'typedi';
import { AuthenticationService } from '../services/AuthenticationService';
import { IError } from '../types/IError';
import { IsAuth } from '../middleware/IsAuth';
import AppendUser from '../middleware/AppendUser';
import { User } from '../types/User';

export class AuthenticationRoutes {
  private router: Router;
  private authenticationService: AuthenticationService;

  constructor() {
    this.router = Router({strict: true});
    this.authenticationService = Container.get(AuthenticationService);

    this.router.post('/login', async (req, res, next) => {
      const { username, password } = req.body;
      let result = await this.authenticationService.Login({username, password});
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });  

    this.router.post('/refresh', async (req, res, next) => {
      const { refreshToken } = req.body;
      let result = await this.authenticationService.Refresh({refreshToken});
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });  

    this.router.post('/test', IsAuth, AppendUser, async (req, res, next) => {
      let user: User = req['user'];
      res.json(user);
    });
  }

  public GetRouter(): Router {
    return this.router;
  }
}
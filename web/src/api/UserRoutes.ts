import { Router } from 'express';
import Container from 'typedi';
import { UserService } from '../services/UserService';
import { IError } from '../types/IError';
import { IsAuth } from '../middleware/IsAuth';
import AppendUser from '../middleware/AppendUser';
import { User } from '../types/User';

export class UserRoutes {
  private router: Router;
  private userService: UserService;

  constructor() {
    this.router = Router({strict: true});
    this.userService = Container.get(UserService);

    this.router.post('/login', async (req, res, next) => {
      const { username, password } = req.body;
      let result = await this.userService.Login({username, password});
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });

    this.router.post('/logout', IsAuth, AppendUser, async (req, res, next) => {
      let user: User = req['user'];
      let result = await this.userService.Logout({_id: user._id});
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });

    this.router.post('/register', async (req, res, next) => {
      const { username, mail, password } = req.body;
      let result = await this.userService.Register({username, mail, password});
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
      let result = await this.userService.Refresh({refreshToken});
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });  

    this.router.post('/delete', IsAuth, AppendUser, async (req, res, next) => {
      let user: User = req['user'];
      let result = await this.userService.Delete({_id: user._id});
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });
  
    this.router.post('/update/username', IsAuth, AppendUser, async (req, res, next) => {
      let user: User = req['user'];
      let { username } = req.body;      
      let result = await this.userService.UpdateUsername({_id: user._id, username});
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });
    
    this.router.post('/update/mail', IsAuth, AppendUser, async (req, res, next) => {
      let user: User = req['user'];
      let { mail } = req.body;      
      let result = await this.userService.UpdateMail({_id: user._id, mail});
      if (result.success)
        res.json(result.data);
      else if (result.error)
        next(result.error);
      else {
        let err: IError = {status: 500, message: 'Fehler'};
        next(err);
      }
    });
    
    this.router.post('/update/password', IsAuth, AppendUser, async (req, res, next) => {
      let user: User = req['user'];
      let { password } = req.body;      
      let result = await this.userService.UpdatePassword({_id: user._id, password});
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
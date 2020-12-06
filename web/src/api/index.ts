import { UserRoutes } from "./UserRoutes"
import { Router } from 'express';
import { MonitorRoutes } from "./MonitorRoutes";

let router = Router({strict: true});

let userRoutes = new UserRoutes();
router.use('/user', userRoutes.GetRouter());

let monitorRoutes = new MonitorRoutes();
router.use('/monitor', monitorRoutes.GetRouter());

export default () => {
  return router;
}
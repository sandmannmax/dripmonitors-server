import { AuthenticationRoutes } from "./Authentication"

let authenticationView = new AuthenticationRoutes();

export default () => {
  return authenticationView.GetRouter();
}
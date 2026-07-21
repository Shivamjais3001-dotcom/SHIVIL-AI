import { authenticate } from "../common/authorization/middlewares/authenticate.middleware";
import { AuthenticatedRequest } from "../common/authorization/types/auth-context.type";

export { authenticate, AuthenticatedRequest };
export const authMiddleware = authenticate;
export default authenticate;

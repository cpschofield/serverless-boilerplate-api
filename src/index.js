import { UserController, AuthController } from './controllers';
import { composeMiddleware, bodyParser } from './middleware';

/**
 * User Controller
 */
const userController = new UserController();
module.exports.login = composeMiddleware(userController.login, [bodyParser()]);
module.exports.register = composeMiddleware(userController.register, [bodyParser()]);
module.exports.me = composeMiddleware(userController.me, [bodyParser()]);
module.exports.getUsers = composeMiddleware(userController.getUsers);

/**
 * Auth Controller
 */
const authController = new AuthController();
module.exports.authenticate = composeMiddleware(authController.authenticate);

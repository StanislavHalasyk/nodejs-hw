import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return next(createHttpError(401, 'Access token missing'));
    }

    const session = await Session.findOne({ accessToken });

    if (!session || session.accessTokenValidUntil < new Date()) {
      return next(createHttpError(401, 'Invalid or expired access token'));
    }

    const user = await User.findById(session.userId);

    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    // додаємо користувача до запиту
    req.user = user;
    req.session = session;

    next();
  } catch (error) {
    next(error);
  }
};

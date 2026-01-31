import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../controllers/authController.js';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validations/authValidation.js';

const router = Router();

router.get('/auth/register', (req, res) => {
  res.status(200).json({
    message: 'Use POST /auth/register',
    requiredFields: {
      email: 'string (valid email)',
      password: 'string (min 8 chars)',
    },
  });
});

router.post('/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/auth/login', celebrate(loginUserSchema), loginUser);
// Новий роут
router.post('/auth/logout', logoutUser);
router.post('/auth/refresh', refreshUserSession);

export default router;

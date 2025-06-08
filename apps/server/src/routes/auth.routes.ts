import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.get('/me', authController.getUserDetails);
router.post('/signup', authController.signup);
router.post('/signup/2fa', authController.signup2FA);
router.get('/signup/qr', authController.getQR);
router.post('/login', authController.login);
router.post('/login/2fa', authController.login2FA);
router.post('/logout', authController.logout);

export default router;

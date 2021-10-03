const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.get('/user/:id', authController.user_details);
router.get('/update/:id', authController.update_details);
router.put('/update/:id', authController.update_user);


module.exports = router;
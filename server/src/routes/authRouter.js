const Router = require('express');
const router = new Router();
const controller = require('../controllers/authController.js');
const {check} = require('express-validator');
const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/registration", [
    check('email', 'Email не может быть пустым').notEmpty(),
    check('email', 'Неправильный формат Email').matches(/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
    check('password', 'Пароль не может быть пустым').notEmpty(),
    check('password', 'Неправильный формат пароля').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)
], controller.registration);
router.post("/login", controller.login);
router.get("/users", authMiddleware, controller.getUsers)

module.exports = router;
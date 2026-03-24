const express = require('express');

const {check} = require('express-validator');

const usersControllers = require('./../controllers/users-controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: users
 *     description: Operaciones relacionadas con usuarios
 * /api/users/:
 *   get:
 *     tags:
 *       - users
 *     summary: Obtener todos los users
 *     responses:
 *       200:
 *         description: Users encontrados
 */
router.get('/', usersControllers.getUsers);


/**
 * @swagger
 * /api/users/singup:
 *   post:
 *     tags:
 *       - users
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               places:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado
 *       400:
 *         description: Datos inválidos
 */
router.post('/singup', 
  [
    check('name').notEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6}),
  ],
  usersControllers.singup);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - users
 *     summary: Login de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', 
  [
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6}),
  ],
  usersControllers.login);



module.exports = router;
const express = require('express');

const {check} = require('express-validator');

const usersControllers = require('./../controllers/users-controller');

const fileUpload = require('../middleware/file-upload');

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
 * /api/users/{uid}:
 *   delete:
 *     tags:
 *       - users
 *     summary: Borra un usuario y todos sus places
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:uid', usersControllers.deleteUserById);



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
 *     responses:
 *       201:
 *         description: Usuario registrado
 *       400:
 *         description: Datos inválidos
 */
router.post('/signup', 
  fileUpload.single('image'),
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
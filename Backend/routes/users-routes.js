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
 * /api/users/signup:
 *   post:
 *     tags:
 *       - users
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               email:
 *                 type: string
 *                 description: Email del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña (mínimo 6 caracteres)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil del usuario
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: ID del usuario creado
 *                 token:
 *                   type: string
 *                   description: JWT token para autenticación
 *       400:
 *         description: Datos inválidos o email ya existe
 *       422:
 *         description: Validación fallida en los datos
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
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: ID del usuario
 *                 token:
 *                   type: string
 *                   description: JWT token para autenticación (usar en header Authorization)
 *       401:
 *         description: Credenciales inválidas
 *       422:
 *         description: Validación fallida en los datos
 */
router.post('/login', 
  [
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6}),
  ],
  usersControllers.login);



module.exports = router;
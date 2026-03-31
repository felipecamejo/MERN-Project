const express = require('express');

const {check} = require('express-validator');

const placesControllers = require('../controllers/places-controller');

const router = express.Router();

const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   - name: places
 *     description: Operaciones relacionadas con lugares
 * /api/places/{pid}:
 *   get:
 *     tags:
 *       - places
 *     summary: Obtener un lugar por ID
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del lugar
 *     responses:
 *       200:
 *         description: Lugar encontrado
 *       404:
 *         description: Lugar no encontrado
 */
router.get('/:pid', placesControllers.getPlaceById)

/**
 * @swagger
 * /api/places/user/{uid}:
 *   get:
 *     tags:
 *       - places
 *     summary: Obtener lugares por ID de usuario
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de lugares del usuario
 *       404:
 *         description: No se encontraron lugares para el usuario
 */
router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.use(checkAuth);

/**
 * @swagger
 * /api/places/{pid}:
 *   patch:
 *     tags:
 *       - places
 *     summary: Actualizar un place por id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del place
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nuevo título del place
 *               description:
 *                 type: string
 *                 description: Nueva descripción del place
 *     responses:
 *       200:
 *         description: Actualizado correctamente
 *       401:
 *         description: No autorizado - Token requerido o inválido
 *       404:
 *         description: No se encontro el lugar por id
 */
router.patch('/:pid',
  [
    check('title').notEmpty(),
    check('description').isLength({min: 5}),
  ],
  placesControllers.updatePlaceById);


/**
 * @swagger
 * /api/places/{pid}:
 *   delete:
 *     tags:
 *       - places
 *     summary: Elimina un place por id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del place
 *     responses:
 *       200:
 *         description: Eliminado correctamente
 *       401:
 *         description: No autorizado - Token requerido o inválido
 *       404:
 *         description: No se encontro el lugar por id
 */
router.delete('/:pid', placesControllers.deletePlaceById);


/**
 * @swagger
 * /api/places:
 *   post:
 *     tags:
 *       - places
 *     summary: Crear un nuevo lugar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - address
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del lugar
 *               description:
 *                 type: string
 *                 description: Descripción del lugar
 *               address:
 *                 type: string
 *                 description: Dirección del lugar
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del lugar
 *     responses:
 *       201:
 *         description: Lugar creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado - Token requerido o inválido
 *       422:
 *         description: Validación fallida en los datos
 */
router.post('/', 
  fileUpload.single('image'),
  [
    check('title').notEmpty(),
    check('description').isLength({min: 5}),
    check('address').notEmpty()
  ],
  placesControllers.createPlace);

module.exports = router;
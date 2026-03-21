const express = require('express');

const placesControllers = require('../controllers/places-controller');

const router = express.Router();

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

/**
 * @swagger
 * /api/places/{pid}:
 *   patch:
 *     tags:
 *       - places
 *     summary: Actualizar un place por id
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
 *       404:
 *         description: No se encontro el lugar por id
 */
router.patch('/:pid', placesControllers.updatePlaceById);


/**
 * @swagger
 * /api/places/{pid}:
 *   delete:
 *     tags:
 *       - places
 *     summary: Elimina un place por id
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *               address:
 *                 type: string
 *               creator:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lugar creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/', placesControllers.createPlace);

module.exports = router;
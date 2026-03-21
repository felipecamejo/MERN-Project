const express = require('express');

const placesControllers = require('../controllers/places-controller');

const router = express.Router();

/**
 * @swagger
 * /api/places/{pid}:
 *   get:
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
 * /api/places:
 *   post:
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
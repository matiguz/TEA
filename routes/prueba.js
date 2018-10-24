const pruebaController = require('../controllers/prueba')
const lineasController = require('../controllers/lineas')

module.exports = (router) => {

    /**
     * Prueba
     */

    router.route('/prueba').get(pruebaController.prueba)
    router.route('/pruebaSus').post(pruebaController.pruebaSus)
    router.route('/meta').get(pruebaController.meta)
    router.route('/lineas/:id').post(lineasController.calcularTeaProximoOmnibus)
}
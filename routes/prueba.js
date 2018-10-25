const pruebaController = require('../controllers/prueba')
const lineasController = require('../controllers/lineas')
const omnibusController = require('../controllers/omnibus')

module.exports = (router) => {

    /**
     * Prueba
     */

    router.route('/prueba').get(pruebaController.prueba)
    router.route('/pruebaSus').post(pruebaController.pruebaSus)
    router.route('/meta').get(pruebaController.meta)
    router.route('/nextBus/:id_linea/:id_parada').get(lineasController.calcularTeaProximoOmnibus)
    router.route('/lineas/:id_linea').get(lineasController.paradasParaLinea)
    router.route('/omnibus/:id_linea').get(omnibusController.omnibusParaLinea)
    router.route('/paraLineaEnRadio').post(omnibusController.omnibusParaLineaEnRadio)
}
const pruebaController = require('../controllers/prueba')
const lineasController = require('../controllers/lineas')
const omnibusController = require('../controllers/omnibus')

module.exports = (router) => {

    router.route('/nextBus/:id_linea/:id_parada').get(lineasController.calcularTeaProximoOmnibus)
    router.route('/pruebaSus').post(lineasController.nuevosDatosDeOmnibusRecibidos)
    // Se necesitan estos endpoints?
    router.route('/lineas/:id_linea').get(lineasController.paradasParaLinea)
    router.route('/omnibus/:id_linea').get(omnibusController.omnibusParaLinea)
    router.route('/paraLineaEnRadio').post(omnibusController.omnibusParaLineaEnRadio)
    router.route('/iniciarCaputraDatos').get(pruebaController.inicio)
    router.route('/finCapturaDatos/:id_subscripcion').get(pruebaController.fin)
}
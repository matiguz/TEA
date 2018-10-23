const pruebaController = require('../controllers/prueba')

module.exports = (router) => {

    /**
     * Prueba
     */

    router
        .route('/prueba')
        .get(pruebaController.prueba)
    
    router
        .route('/pruebaSus')
        .get(pruebaController.pruebaSus)
}
const assert           = require('assert');
const dotEnv           = require('dotenv').config()
const pruebaController = require('../controllers/prueba');

const tiempoMinimoDeViajeParaConsiderarDatosReales = parseFloat(process.env.TIEMPO_MINIMO_DE_VIAJE_EN_SEG_PARA_CONSIDERAR_DATOS_REALES)
const velocidadEnMetrosPorSegundoPromedioDefecto = parseFloat(process.env.VELOCIDAD_PROMEDIO_POR_DEFECTO_EN_METROS_POR_SEGUNDO)

if (!tiempoMinimoDeViajeParaConsiderarDatosReales) {
    console.log("Please create an .env file in the root folder of the project and set a TIEMPO_MINIMO_DE_VIAJE_EN_SEG_PARA_CONSIDERAR_DATOS_REALES var");
    process.exit();
}

if (!velocidadEnMetrosPorSegundoPromedioDefecto) {
    console.log("Please create an .env file in the root folder of the project and set a VELOCIDAD_PROMEDIO_POR_DEFECTO_EN_METROS_POR_SEGUNDO var");
    process.exit();
}

describe('pruebaController', function() {
  describe('velocidadPromedio sin datos', function() {
    const idLinea = 522;
    const idOmnibus = 1;

    const velocidadPromedioCalculada = pruebaController.calcularVelocidadPromedioDeOmnibus(idLinea, idOmnibus);

    it('debe retornar ' + velocidadEnMetrosPorSegundoPromedioDefecto + ' cuando no hay datos', function() {
      assert.equal(velocidadPromedioCalculada, velocidadEnMetrosPorSegundoPromedioDefecto);
    });
  });

  describe('velocidadPromedio con tiempo de viaje transcurrido menor al necesario', function() {
    const idLinea = 522;
    const idOmnibus = 2;
    const nuevaUbicacion = {latitude: 51.5103, longitude: 7.49347};
    const tiempoDeActualizacion = new Date();

    pruebaController.actualizarInfoDeOmnibus(idLinea, idOmnibus, nuevaUbicacion, tiempoDeActualizacion);
    const velocidadPromedioCalculada = pruebaController.calcularVelocidadPromedioDeOmnibus(idLinea, idOmnibus);

    it('debe retornar ' + velocidadEnMetrosPorSegundoPromedioDefecto + ' cuando no ha pasado el tiempo suficiente de viaje', function() {
      assert.equal(velocidadPromedioCalculada, velocidadEnMetrosPorSegundoPromedioDefecto);
    });
  });

  describe('velocidadPromedio con tiempo de viaje transcurrido mayor al necesario', function() {
    const idLinea = 522;
    const idOmnibus = 3;

    var nuevaUbicacion = {latitude: 51.5103, longitude: 7.49347};
    var tiempoDeActualizacion = new Date();

    pruebaController.actualizarInfoDeOmnibus(idLinea, idOmnibus, nuevaUbicacion, tiempoDeActualizacion);

    nuevaUbicacion = {latitude: 51.5103, longitude: 8.49347};
    tiempoDeActualizacion = tiempoDeActualizacion.getTime() + (11 * 600000);

    pruebaController.actualizarInfoDeOmnibus(idLinea, idOmnibus, nuevaUbicacion, tiempoDeActualizacion);

    const velocidadPromedioCalculada = pruebaController.calcularVelocidadPromedioDeOmnibus(idLinea, idOmnibus);
    const velocidadEntreRecorrido = 10.52;

    it('debe retornar la velocidad promedio real calculada cuando ha pasado el tiempo suficiente de viaje', function() {
      assert.equal(velocidadPromedioCalculada, velocidadEntreRecorrido);
    });
  });

  describe('velocidadPromedio con tiempo de viaje transcurrido mayor al necesario', function() {
    const idLinea = 522;
    const idOmnibus = 4;
  
    var nuevaUbicacion = {latitude: 51.5103, longitude: 7.49347};
    const tiempoActual = new Date();
  
    pruebaController.actualizarInfoDeOmnibus(idLinea, idOmnibus, nuevaUbicacion, tiempoActual);
  
    nuevaUbicacion = {latitude: 51.5103, longitude: 8.49347};
    var tiempoDeActualizacion = tiempoActual.getTime() + (11 * 600000);
  
    pruebaController.actualizarInfoDeOmnibus(idLinea, idOmnibus, nuevaUbicacion, tiempoDeActualizacion);
  
    nuevaUbicacion = {latitude: 51.5103, longitude: 8.49347};
    tiempoDeActualizacion = tiempoActual.getTime() + (20 * 600000);
  
    pruebaController.actualizarInfoDeOmnibus(idLinea, idOmnibus, nuevaUbicacion, tiempoDeActualizacion);
  
    const velocidadPromedioCalculada = pruebaController.calcularVelocidadPromedioDeOmnibus(idLinea, idOmnibus);
    const velocidadEntreRecorrido = 5.79;
  
    it('debe retornar la velocidad promedio real calculada cuando ha pasado el tiempo suficiente de viaje', function() {
      assert.equal(velocidadPromedioCalculada, velocidadEntreRecorrido);
    });
  });
  
});
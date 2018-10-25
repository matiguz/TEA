let geoLib = require('geolib');
const axios = require('../helpers/axios');

const controllerCoordenadas = require('./coordenadas')
const controllerOmnibus = require('./omnibus')

const externalURL = process.env.API_URL
const observerURL = process.env.SERVER_URL
const serverURL = process.env.SERVER_URL
const tiempoMinimoDeViajeParaConsiderarDatosReales = parseFloat(process.env.TIEMPO_MINIMO_DE_VIAJE_EN_SEG_PARA_CONSIDERAR_DATOS_REALES)
const velocidadEnMetrosPorSegundoPromedioDefecto = parseFloat(process.env.VELOCIDAD_PROMEDIO_POR_DEFECTO_EN_METROS_POR_SEGUNDO)

if (!externalURL) {
    console.log("Please create an .env file in the root folder of the project and set a API_URL var");
    process.exit();
}

if (!observerURL) {
    console.log("Please create an .env file in the root folder of the project and set a SERVER_URL var");
    process.exit();
}

if (!tiempoMinimoDeViajeParaConsiderarDatosReales) {
    console.log("Please create an .env file in the root folder of the project and set a TIEMPO_MINIMO_DE_VIAJE_EN_SEG_PARA_CONSIDERAR_DATOS_REALES var");
    process.exit();
}

if (!velocidadEnMetrosPorSegundoPromedioDefecto) {
    console.log("Please create an .env file in the root folder of the project and set a VELOCIDAD_PROMEDIO_POR_DEFECTO_EN_METROS_POR_SEGUNDO var");
    process.exit();
}

console.log(`API URL: ${externalURL}`);
console.log(`SERVER URL: ${observerURL}`);
console.log(`TIEMPO_MINIMO_DE_VIAJE_EN_SEG_PARA_CONSIDERAR_DATOS_REALES: ${tiempoMinimoDeViajeParaConsiderarDatosReales}`);
console.log(`VELOCIDAD_PROMEDIO_POR_DEFECTO_EN_METROS_POR_SEGUNDO: ${velocidadEnMetrosPorSegundoPromedioDefecto}`);

const velocidadesPorLinea = {}

const actualizarInfoDeOmnibus = (idLinea, idOmnibus, nuevaUbicacion, tiempoDeActualizacion) => {
    if (!velocidadesPorLinea[idLinea]) {
        velocidadesPorLinea[idLinea] = {}
    }

    if (!velocidadesPorLinea[idLinea][idOmnibus]) {
        const distanciaRecorrida = 0;
        const tiempo = 0

        velocidadesPorLinea[idLinea][idOmnibus] = {
            "ultima_ubicacion": nuevaUbicacion,
            "distancia_recorrida_metros": 0,
            "tiempo_parcial_viaje_segundos": 0,
            "tiempo_ultima_actualizacion": tiempoDeActualizacion
        }
    } else {
        const ultimaUbicacionRecibida = velocidadesPorLinea[idLinea][idOmnibus]["ultima_ubicacion"];
        const distanciaRecorridaDesdeUltimaActualizacion = geoLib.getDistance(ultimaUbicacionRecibida, nuevaUbicacion);
        const distanciaTotalRecorridaEnMetros = velocidadesPorLinea[idLinea][idOmnibus]["distancia_recorrida_metros"] + distanciaRecorridaDesdeUltimaActualizacion;
        const tiempoEnSegundosDesdeUltimaActualizacion = (new Date(tiempoDeActualizacion).getTime() - velocidadesPorLinea[idLinea][idOmnibus]["tiempo_ultima_actualizacion"]) / 1000;
        const tiempoDeViaje = velocidadesPorLinea[idLinea][idOmnibus]["tiempo_parcial_viaje_segundos"] + tiempoEnSegundosDesdeUltimaActualizacion;

        velocidadesPorLinea[idLinea][idOmnibus] = {
            "ultima_ubicacion": nuevaUbicacion,
            "distancia_recorrida_metros": distanciaTotalRecorridaEnMetros,
            "tiempo_parcial_viaje_segundos": tiempoDeViaje,
            "tiempo_ultima_actualizacion": tiempoDeActualizacion
        }
    }
}

const calcularVelocidadPromedioDeOmnibus = (idLinea, idOmnibus) => {
    var velocidad = velocidadEnMetrosPorSegundoPromedioDefecto;

    const datosInsuficientesParaCalcularVelocidad = (!velocidadesPorLinea[idLinea] || !velocidadesPorLinea[idLinea][idOmnibus] || velocidadesPorLinea[idLinea][idOmnibus]["tiempo_parcial_viaje_segundos"] < tiempoMinimoDeViajeParaConsiderarDatosReales);

    if (!datosInsuficientesParaCalcularVelocidad) {
        const tiempoParcialViaje = velocidadesPorLinea[idLinea][idOmnibus]["tiempo_parcial_viaje_segundos"];
        const distanciaRecorridaEnMetros = velocidadesPorLinea[idLinea][idOmnibus]["distancia_recorrida_metros"];

        velocidad = distanciaRecorridaEnMetros / tiempoParcialViaje;
    }

    return Number((velocidad).toFixed(2));
}

module.exports = {

    /***
     ***PRUEBA
     ***/

    actualizarInfoDeOmnibus: actualizarInfoDeOmnibus,
    calcularVelocidadPromedioDeOmnibus: calcularVelocidadPromedioDeOmnibus,

    prueba: (req, res) => {
 /*       axios.inst.get(`${externalURL}:1026/v2/entities?type=Bus&limit=10`)
            .then(function (response) {
                console.log(response.data.length);
            })
            .catch(function (error) {
                console.log(error);
            });

        axios.inst.get(`${externalURL}/api/trayectosporlinea`)
            .then(function (response) {
                console.log(response.data.trayectos.length);
            })
            .catch(function (error) {
                console.log(error);
            });

            axios.inst.get(`${serverURL}/omnibus/522`)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });

*/
         /*axios.inst({
            method: 'post',
            url: `${externalURL}:1026/v2/subscriptions`,
            data: {
                "subject": {
                    "entities": [{
                        "id": "20",
                        "type": "Bus",
                    }],

                    "condition": {
                        "attrs": [
                            "location"
                        ]
                    }
                },
                "notification": {
                    "http": {
                        "url": observerURL+"/pruebaSus"
                    },
                    "attrs": [
                        "location",
                        "id",
                        "linea"
                    ]
                }
            }
        }).catch(function (error) {
            console.log(error);
        });*/
        
          /*axios.inst({
            method: 'delete',
            url: `${externalURL}:1026/v2/subscriptions/5bd0b719a0a51b54fa37de74`
          });*/

         const p1 = {
            latitude: -34.7844931,
            longitude: -56.2239004
        }

        const p2 = {
            latitude: -34.799506,
            longitude: -56.228390
        }

        let result = geoLib.getDistance(p1, p2);

        res.send(result);
    },

    pruebaSus: (req, res) => {
        console.log(req.body.data[0].location.value);
        //console.log(req.body.data.length);
        for (let i = 0; i < req.body.data.length; i++) {
          let result = geoLib.distance({
              p1: {
                  lat: -34.7782030444606,
                  lon: -56.137229843163
              },
              p2: {
                  lat: req.body.data[i].location.value.coordinates[1],
                  lon: req.body.data[i].location.value.coordinates[0]
              }
          });
          console.log(result);
          
        }
        
        res.send("bien");
    },

    meta: (req, res) => {
        axios.inst({
            method: 'post',
            url: `${externalURL}:1026/v2/op/query`,
            data: {
                "entities": [{
                    "idPattern": ".*"
                }],
                "attrs": [
                    "linea"
                ],
                "expression": {
                    "q": "linea=='241'"
                }
            }

        }).then(function (response) {
            console.log(response.data[0].linea);
        }).catch(function (error) {
            console.log(error);
        });
        res.send("puto")
    }
}
let geoLib = require('geolib');
const axios = require('../helpers/axios');

const controllerCoordenadas = require('./coordenadas')
const controllerOmnibus = require('./omnibus')

let tiempo;

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

module.exports = {

    /***
     ***PRUEBA
     ***/

    inicio: (req,res) => {
        axios.inst({
            method: 'post',
            url: `${externalURL}:1026/v2/subscriptions`,
            data: {
                "subject": {
                    "entities": [{
                        "idPattern": ".*",
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
                        "linea",
                        "timestamp",
                    ]
                }
            }
        }).then((result) => {
            console.log("Se comenzó a escuchar la suscripcion")
        }).catch(function (error) {
            console.log(error);
        });
    },
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

*//*
         axios.inst({
            method: 'post',
            url: `${externalURL}:1026/v2/subscriptions`,
            data: {
                "subject": {
                    "entities": [{
                        "id": "961",
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
                        "url": observerURL+":3001/pruebaSus"
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
        });
        
          *//*axios.inst({
            method: 'delete',
            url: `${externalURL}:1026/v2/subscriptions/5bd1066b96d14c53d458aa71`
        });*/

        /*let a = controllerCoordenadas.puntoMedio({lat: -34.7844931,lon: -56.2239004},{lat: -34.799506,lon: -56.228390})
        console.log(a);
*/
        /*        controllerOmnibus.omnibusParaLineaEnRadio({lat:-34.7782030444606,lon:-56.137229843163},30000,522).then((response)=>{
                    console.log(response);
                  }
                );
      /*
                axios.inst({
                  method: 'post',
                  url: `${externalURL}:1026/v1/queryContext`,
                  data: {
                    "entities": [
                      {
                          "type": "Bus",
                          "isPattern": "true",
                          "id": ".*"
                      }
                  ],
                  "restriction": {
                      "scopes": [
                          {
                              "type": "FIWARE::Location",
                              "value": {
                                  "circle": {
                                      "centerLatitude": "-34.7782030444606",
                                      "centerLongitude": "-56.137229843163",
                                      "radius": "10000"
                                  }
                              }
                          },
                          {
                            "type": "FIWARE::StringQuery",
                            "value": "linea=='501'"
                          }
                      ]
                  }
                }
              }).then(function (response) {
                console.log(response.data.contextResponses);
            }).catch(function (error) {
                  console.log(error);
              });
      */

        /*axios.inst({
            method: 'post',
            url: `${serverURL}:3001/paraLineaEnRadio`,
            data: {
                "linea": "522",
                "radio": "2000",
                "centro":{
                    "lat":"-34.7887465410069",
                    "lon":"-56.1362089184452"
                }
            }
        }).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.log(error);
        });

        const p1 = {
            latitude: -34.7844931,
            longitude: -56.2239004
        };

        const p2 = {
            latitude: -34.799506,
            longitude: -56.228390
        }
        
        let result = geoLib.getDistance(p1, p2);
*/
        res.send("todo legal");
    },

    // pruebaSus: (req, res) => {
    //         let {id} = req.body.data[0];
    //         let coordinates = {
    //             longitude:req.body.data[0].location.value.coordinates[0],
    //             latitude:req.body.data[0].location.value.coordinates[1]
    //         }
    //         let linea = req.body.data[0].linea.value;
    //         let tiempo = new Date(req.body.data[0].timestamp.value);
    //         if (linea =="217"){
    //             let result = calcularVelocidadPromedioDeOmnibus(217,68)
    //             console.log(result);

    //         }
    //         actualizarInfoDeOmnibus(linea,id,coordinates,tiempo)
    //         res.send("bien");
    // },

    meta: (req, res) => {
        
        console.log("la meta");
       
        let result = calcularVelocidadPromedioDeOmnibus(217,34)
        console.log(result);
       
        /* axios.inst({
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
        });*/
        res.send("result")
    }
}
let geoLib = require('geo-lib');
const axios = require('../helpers/axios');

const controllerCoordenadas = require('./coordenadas')
const controllerOmnibus = require('./omnibus')

const externalURL = process.env.API_URL
const observerURL = process.env.SERVER_URL
const serverURL = process.env.SERVER_URL

if (!externalURL) {
    console.log("Please create an .env file in the root folder of the project and set a API_URL var");
    process.exit();
}

if (!observerURL) {
    console.log("Please create an .env file in the root folder of the project and set a SERVER_URL var");
    process.exit();
}

console.log(`API URL: ${externalURL}`)
console.log(`SERVER URL: ${observerURL}`)

module.exports = {

    /***
     ***PRUEBA
     ***/

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
          
        let result = geoLib.distance({
            p1: {
                lat: -34.7844931,
                lon: -56.2239004
            },
            p2: {
                lat: -34.799506,
                lon: -56.228390
            }
        });

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
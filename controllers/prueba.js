let geoLib = require('geo-lib');
const axios = require('../helpers/axios');

const externalURL = process.env.API_URL
const observerURL = process.env.SERVER_URL

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
        axios.inst.get(`${externalURL}:1026/v2/entities?type=Bus&limit=10`)
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

        axios.inst({
            method: 'post',
            url: `${externalURL}:1026/v2/subscriptions`,
            data: {
                "subject": {
                    "entities": [{
                        "idPattern": ".*",
                        "type": "Bus",
                        "attrs": [{
                            "linea": "7516"
                        }]
                    }],

                    "condition": {
                        "attrs": [
                            "location"
                        ]
                    }
                },
                "notification": {
                    "http": {
                        "url": observerURL
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

        /*  axios.inst({
            method: 'delete',
            url: '${url}:1026/v2/subscriptions/5bcfa3b304a44ed51c2bf75e'
          });*/
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
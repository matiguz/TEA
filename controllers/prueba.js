let geoLib = require('geo-lib');
const axios = require('../helpers/axios');

module.exports = {

    /***
    ***PRUEBA
    ***/
    
    prueba: (req, res) => {
      
     axios.inst.get('http://192.168.56.101:1026/v2/entities?type=Bus&limit=10')
      .then(function (response) {
          console.log(response.data.length);
      })
      .catch(function (error) {
          console.log(error);
      });

      axios.inst.get('http://192.168.56.101/api/trayectosporlinea')
        .then(function (response) {
            console.log(response.data.trayectos.length);
        })
        .catch(function (error) {
            console.log(error);
        });

     /**/    axios.inst({
            method: 'post',
            url: 'http://192.168.56.101:1026/v2/subscriptions',
            data: {
                "subject": {
                    "entities": [
                      { 
                        "idPattern":".*",
                        "type": "Bus",
                        "attrs": [
                          {"linea":"7516"}
                        ]
                      }
                    ],
                    
                    "condition": {
                      "attrs": [
                        "location"
                      ]
                    }
                },
              "notification": {
                "http": {
                  "url": "http://192.168.56.1:3001/pruebaSus"
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
            url: 'http://192.168.56.101:1026/v2/subscriptions/5bcfa3b304a44ed51c2bf75e'
          });*/
        let result = geoLib.distance({
            p1: { lat: -34.7844931, lon: -56.2239004 },
            p2: { lat: -34.799506, lon: -56.228390 }
        });
      //  res.send(distance);
        res.send(result);
    },

    pruebaSus: (req, res) => {

        console.log(req.body.data[0].location.value);
        res.send("bien");
    },

    meta: (req, res) => {
      axios.inst({
        method: 'post',
        url: 'http://192.168.56.101:1026/v2/op/query',
        data: {
          "entities": [
            {
              "idPattern": ".*"
            }
          ],
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
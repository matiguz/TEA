let geoLib = require('geo-lib');
const axios = require('../helpers/axios');

module.exports = {

    /***
    ***PRUEBA
    ***/
    
    prueba: (req, res) => {

     axios.inst.get('http://tea.ddns.net:1026/v2/entities?type=Bus&limit=10')
      .then(function (response) {
          console.log(response.data.length);
      })
      .catch(function (error) {
          console.log(error);
      });

      axios.inst.get('http://tea.ddns.net/api/trayectosporlinea')
        .then(function (response) {
            console.log(response.data.trayectos.length);
        })
        .catch(function (error) {
            console.log(error);
        });

        /*axios.inst({
            method: 'post',
            url: 'http://tea.ddns.net:1026/v2/subscriptions',
            data: {
                "subject": {
                    "entities": [
                      {
                        "id": "241",
                        "type": "Bus"
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
                  "url": "http://localhost:3001/pruebaSus"
                },
                "attrs": [
                  "location"
                ]
              }
            }
          });*/
        /*
          axios.inst({
            method: 'delete',
            url: 'http://tea.ddns.net:1026/v2/subscriptions/5bcf1d824429266f75068d11'
          });*/

        let result = geoLib.distance({
            p1: { lat: -34.7844931, lon: -56.2239004 },
            p2: { lat: -34.799506, lon: -56.228390 }
        });
      //  res.send(distance);
        res.send(result);
    },

    pruebaSus: (req, res) => {

        console.log(res);
    }
}
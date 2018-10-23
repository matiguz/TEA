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

        let result = geoLib.distance({
            p1: { lat: -34.7844931, lon: -56.2239004 },
            p2: { lat: -34.799506, lon: -56.228390 }
        });
      //  res.send(distance);
        res.send(result);
    }
}
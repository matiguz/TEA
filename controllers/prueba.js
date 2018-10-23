let geoLib = require('geo-lib');

module.exports = {

    /***
    ***PRUEBA
    ***/
    
    prueba: (req, res) => {
       /* let a = geolib.getDistance(
            {latitude: , longitude: },
            {latitude: , longitude: }
        );*/

        // Make a request for a user with a given ID
        const axios = require('axios');

        axios.get('http://tea.ddns.net:1026/v2/entities?type=Bus&limit=10')
        .then(function (response) {
            console.log(response.data.length);
        })
        .catch(function (error) {
            console.log(error);
        });

        axios.get('http://tea.ddns.net/api/trayectosporlinea')
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
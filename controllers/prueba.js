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
        let result = geoLib.distance({
            p1: { lat: -34.7844931, lon: -56.2239004 },
            p2: { lat: -34.799506, lon: -56.228390 }
        });
      //  res.send(distance);
        res.send(result);
    }
}
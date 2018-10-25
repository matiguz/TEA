let geoLib = require('geolib');

module.exports = {
    distancia: (coord1, coord2) => {
        return geoLib.getDistance({latitude: coord1.lat, longitude: coord1.lon},{latitude: coord2.lat, longitude: coord2.lon});
    },
    puntoMedio: (coord1, coord2) => {
        return geoLib.getCenter ([{latitude: coord1.lat, longitude: coord2.lon},{latitude: coord1.lat, longitude: coord2.lon}]);
    }
}
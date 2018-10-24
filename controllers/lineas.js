const axios = require('../helpers/axios');
const _ = require('lodash');

const externalURL = process.env.API_URL

module.exports = {
    paradasParaLinea: (req, res) => {
        const linea = req.params.id_linea;
        console.log("linea: " + linea);

        axios.inst.get(`${externalURL}/api/trayectosporlinea`)
        .then((response) => {
            const trayectos = response.data.trayectos;
            const trayectosParaLinea = _.filter(trayectos, (parada) => {
                return parada.linea == linea;
            });

            res.send(trayectosParaLinea);
        })
        .catch((error) => {
            console.log(error);
            res.send();
        });
    },

    calcularTeaProximoOmnibus: (req, res) => {
        const linea = req.params.id_linea;
        const parada = req.params.id_parada;
        const teaEnSegundos = 342;
        const location = {
            "type": "Point",
            "coordinates": [-56.19539, -34.90608]
        }
        
        // 

        const data = {
            "linea": linea,
            "parada": parada,
            "location": location,
            "tea": teaEnSegundos
        }

        res.send(data);
    }
}
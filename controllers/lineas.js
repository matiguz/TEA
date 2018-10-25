const axios = require('../helpers/axios');
const _ = require('lodash');

const externalURL = process.env.API_URL

const getParadasParaLinea = (linea) => {
    return axios.inst.get(`${externalURL}/api/trayectosporlinea`)
    .then((response) => {
        const trayectos = response.data.trayectos;
        const paradas = _.filter(trayectos, (parada) => {
            return parada.linea == linea;
        });

        return paradas;
    })
    .catch((error) => {
        return null;
    });
}

module.exports = {
    paradasParaLinea: (req, res) => {
        const linea = req.params.id_linea;

        getParadasParaLinea(linea)
        .then((paradas) => {
            res.send(paradas);
        })
        .catch((error) => {
            res.send([]);
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
        
        getParadasParaLinea(linea)
        .then((paradas) => {
            const data = {
                "linea": linea,
                "parada": parada,
                "location": location,
                "tea": teaEnSegundos
            }
    
            res.send(data);
        })
        .catch((error) => {
            res.send({error: "No se pudo obtener el tea"});
        });
    }
}
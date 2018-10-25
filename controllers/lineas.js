const axios = require('../helpers/axios');
const _ = require('lodash');

const externalURL = process.env.API_URL
const serverURL = process.env.SERVER_URL

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

    coordenadasParadaAnterior: (req, res) => {
        const ordinal_parada = req.params.ordinal_parada;
        const linea = req.params.id_linea;

        axios.inst.get(`${serverURL}:3001/lineas/${linea}`)
    .then((response) => {
        let paradaAnterior;
        if (ordinal_parada > 1 && ordinal_parada < response.data.length){
            paradaAnterior = response.data[ordinal_parada-2];
        }else {
            paradaAnterior = { 
                codigoParada: '',
                linea: '',
                ordinal: '',
                calle: '',
                esquina: '',
                long: '',
                lat: ''
            }
        }

        const data = {
            "lat":paradaAnterior.lat,
            "lon":paradaAnterior.long
        }
        res.send(data);
        return null;
    })
    .catch((error) => {
        console.log(error)
        return null;
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
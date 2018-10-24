const axios = require('../helpers/axios');
const _ = require('lodash');

const externalURL = process.env.API_URL

const getOmnibusParaLinea = (linea) => {
    return axios.inst.get(`${externalURL}:1026/v2/entities?q=linea==%27${linea}%27`)
    .then((response) => {
        console.log("puto")
        return response.data;
    })
    .catch((error) => {
        return null;
    });
}

module.exports = {
    omnibusParaLinea: (req, res) => {
        const linea = req.params.id_linea;
        
        getOmnibusParaLinea(linea)
        .then((omnibus) => {
            res.send(omnibus);
        })
        .catch((error) => {
            res.send([]);
        });
    }
}
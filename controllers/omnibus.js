const axios = require('../helpers/axios');
const _ = require('lodash');

const externalURL = process.env.API_URL

const getOmnibusParaLinea = (linea) => {
    return axios.inst.get(`${externalURL}:1026/v2/entities?q=linea==%27${linea}%27`)
    .then((response) => {
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
    },
    omnibusParaLineaEnRadio: (req,res) => {
        
        const centro = req.body.centro;
        const radio = req.body.radio;
        const linea = req.body.linea;
        
        
        axios.inst({
            method: 'post',
            url: `${externalURL}:1026/v1/queryContext`,
            data: {
              "entities": [
                {
                    "type": "Bus",
                    "isPattern": "true",
                    "id": ".*"
                }
            ],
            "restriction": {
                "scopes": [
                    {
                        "type": "FIWARE::Location",
                        "value": {
                            "circle": {
                                "centerLatitude": `${centro.lat}`,
                                "centerLongitude": `${centro.lon}`,
                                "radius": `${radio}`
                            }
                        }
                    },
                    {
                      "type": "FIWARE::StringQuery",
                      "value": `linea=='${linea}'`
                    }
                ]
            }
          }
        }).then(function (response) {
            res.send(response.data.contextResponses);    
      }).catch(function (error) {
            console.log(error);
    });
    }
}
const axios = require('../helpers/axios');
const _ = require('lodash');

const coordenadas = require('./coordenadas')
const prueba = require('./prueba')

const externalURL = process.env.API_URL
const serverURL = process.env.SERVER_URL

const distanciaParcial = {};

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

const pruebaRecursiva = (linea,parada) => {
    return new Promise((resP,rejP) => {
        try {
            getOrdinalParada(parada,linea)
        .then((paradaAnterior) => {
            let ord = paradaAnterior[0].ordinal;
            axios.inst.get(`${serverURL}/paradaAnterior/${linea}/${ord}`)
                .then(function (response) {
                    let coordenadaParadaAnterior = response.data;
                    let coordenadaParadaActual = { "lat": paradaAnterior[0].lat, "lon": paradaAnterior[0].long };
                    let centro = coordenadas.puntoMedio(coordenadaParadaActual, coordenadaParadaAnterior)
                    let radio = coordenadas.distancia(coordenadaParadaActual, coordenadaParadaAnterior) / 2;

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
                                                "centerLatitude": `${centro.latitude}`,
                                                "centerLongitude": `${centro.longitude}`,
                                                "radius": `${radio*1.5}`
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
                        if (!response.data.errorCode) {
                            console.log("Bueno que encontre bondiiii")
                            let omnibus = response.data.contextResponses;
                            for (let i = 0; i < omnibus.length; i++) {
                                console.log(omnibus[i].contextElement.attributes[2].value.coordinates);
                                //  coordenadas.distancia()
                            }
                            console.log(distanciaParcial['dist'])
                            //FALTA SUMAR LA ULTIMA DISTANCIA

                            let id_omnibus = console.log(omnibus[0].contextElement.id)
                            let distanciaRestante = distanciaParcial['dist'];
                            let velMedia = prueba.calcularVelocidadPromedioDeOmnibus(linea,id_omnibus)
                            console.log("Vel media", velMedia);
                            let tea = distanciaRestante / velMedia;
                            console.log("Tea aprox", tea);




                            resP(tea)
                        } else {
                            console.log(coordenadaParadaAnterior);
                            distanciaParcial['dist'] = distanciaParcial['dist'] + radio *2;
                            

                            pruebaRecursiva(linea,coordenadaParadaAnterior.codigoParada);
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log(error);
        });
        } catch (error) {
            rejP(error);
        }
        
          
    });
        
        
        /**/
}

const getOrdinalParada = (codigoParada,linea) => {
    return axios.inst.get(`${externalURL}/api/trayectosporlinea`)
        .then((response) => {
            const trayectos = response.data.trayectos;
            const ordinal = _.filter(trayectos, (parada) => {
                return (parada.codigoParada == codigoParada && parada.linea == linea)
            });

            return ordinal;
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

        axios.inst.get(`${serverURL}/lineas/${linea}`)
            .then((response) => {
                let paradaAnterior;
                if (ordinal_parada > 1 && ordinal_parada < response.data.length + 1) {
                    paradaAnterior = response.data[ordinal_parada - 2];
                } else {
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
                    "lat": paradaAnterior.lat,
                    "lon": paradaAnterior.long,
                    "codigoParada" : paradaAnterior.codigoParada
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
        
        distanciaParcial['dist'] = 0;
        pruebaRecursiva(linea,parada).then((result) => {
            console.log("oyti ek qy")
            console.log("oyti ek qy")
            console.log("oyti ek qy")
            console.log("oyti ek qy")
            console.log("oyti ek qy")
            console.log("oyti ek qy")
            console.log("oyti ek qy")
            console.log("oyti ek qy")
            console.log("oyti ek qy")
            console.log("oyti ek qy")
            console.log("oyti ek qy")
        }).catch((error) => {
            console.log("porque hay error", error)
        });



        const data = {
            "linea": linea,
            "parada": parada,
            "location": location,
            "tea": teaEnSegundos
        }

        res.send("termina en consola");
    }
}
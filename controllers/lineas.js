const axios = require('../helpers/axios');
const _ = require('lodash');

const coordenadas = require('./coordenadas')

const externalURL = process.env.API_URL

const tiempoMinimoDeViajeParaConsiderarDatosReales = parseFloat(process.env.TIEMPO_MINIMO_DE_VIAJE_EN_SEG_PARA_CONSIDERAR_DATOS_REALES)
const velocidadEnMetrosPorSegundoPromedioDefecto = parseFloat(process.env.VELOCIDAD_PROMEDIO_POR_DEFECTO_EN_METROS_POR_SEGUNDO)

const velocidadesPorLinea = {}

const nuevosDatosDeOmnibusRecibidos = (req, res) => {
    let {id} = req.body.data[0];

    let coordinates = {
        longitude: req.body.data[0].location.value.coordinates[0],
        latitude: req.body.data[0].location.value.coordinates[1]
    }

    let linea = req.body.data[0].linea.value;
    let tiempo = new Date(req.body.data[0].timestamp.value);

    actualizarInfoDeOmnibus(linea, id, coordinates, tiempo);
    res.send({success: true});
}

const actualizarInfoDeOmnibus = (idLinea, idOmnibus, nuevaUbicacion, tiempoDeActualizacion) => {
    if (!velocidadesPorLinea[idLinea]) {
        velocidadesPorLinea[idLinea] = {}
    }

    if (!velocidadesPorLinea[idLinea][idOmnibus]) {
        const distanciaRecorrida = 0;
        const tiempo = 0

        velocidadesPorLinea[idLinea][idOmnibus] = {
            "ultima_ubicacion": nuevaUbicacion,
            "distancia_recorrida_metros": 0,
            "tiempo_parcial_viaje_segundos": 0,
            "tiempo_ultima_actualizacion": tiempoDeActualizacion
        }
    } else {
        const ultimaUbicacionRecibida = velocidadesPorLinea[idLinea][idOmnibus]["ultima_ubicacion"];
        const distanciaRecorridaDesdeUltimaActualizacion = geoLib.getDistance(ultimaUbicacionRecibida, nuevaUbicacion);
        const distanciaTotalRecorridaEnMetros = velocidadesPorLinea[idLinea][idOmnibus]["distancia_recorrida_metros"] + distanciaRecorridaDesdeUltimaActualizacion;
        const tiempoEnSegundosDesdeUltimaActualizacion = (new Date(tiempoDeActualizacion).getTime() - new Date(velocidadesPorLinea[idLinea][idOmnibus]["tiempo_ultima_actualizacion"]).getTime()) / 1000;
        const tiempoDeViaje = velocidadesPorLinea[idLinea][idOmnibus]["tiempo_parcial_viaje_segundos"] + tiempoEnSegundosDesdeUltimaActualizacion;

        velocidadesPorLinea[idLinea][idOmnibus] = {
            "ultima_ubicacion": nuevaUbicacion,
            "distancia_recorrida_metros": distanciaTotalRecorridaEnMetros,
            "tiempo_parcial_viaje_segundos": tiempoDeViaje,
            "tiempo_ultima_actualizacion": tiempoDeActualizacion
        }
    }
}

const calcularVelocidadPromedioDeOmnibus = (idLinea, idOmnibus) => {
    var velocidad = velocidadEnMetrosPorSegundoPromedioDefecto;

    const datosInsuficientesParaCalcularVelocidad = (!velocidadesPorLinea[idLinea] || !velocidadesPorLinea[idLinea][idOmnibus] || velocidadesPorLinea[idLinea][idOmnibus]["tiempo_parcial_viaje_segundos"] < tiempoMinimoDeViajeParaConsiderarDatosReales);

    if (!datosInsuficientesParaCalcularVelocidad) {
        const tiempoParcialViaje = velocidadesPorLinea[idLinea][idOmnibus]["tiempo_parcial_viaje_segundos"];
        const distanciaRecorridaEnMetros = velocidadesPorLinea[idLinea][idOmnibus]["distancia_recorrida_metros"];

        velocidad = distanciaRecorridaEnMetros / tiempoParcialViaje;
    }

    return Number((velocidad).toFixed(2));
}

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

const obtenerSiguienteParadaDadaLineaYOrdinalDeParada = async (linea, ordinal) => {
    return getParadasParaLinea(linea)
        .then((paradas) => {
            let paradaAnterior;

            if (ordinal > 1 && ordinal < paradas.length + 1) {
                paradaAnterior = paradas[ordinal - 2];
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
                "codigoParada": paradaAnterior.codigoParada
            }

            return (data);
        })
}

const buscarOmnibusDadaLineaUbicacionYRadio = async (linea, ubicacion, radio) => {
    return axios.inst({
        method: 'post',
        url: `${externalURL}:1026/v1/queryContext`,
        data: {
            "entities": [{
                "type": "Bus",
                "isPattern": "true",
                "id": ".*"
            }],
            "restriction": {
                "scopes": [{
                        "type": "FIWARE::Location",
                        "value": {
                            "circle": {
                                "centerLatitude": `${ubicacion.latitude}`,
                                "centerLongitude": `${ubicacion.longitude}`,
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
            let listadoOmnibus = response.data.contextResponses;
            let omnibusId = listadoOmnibus[0].contextElement.id;

            const distanciaAlOmnibus = radio * 2; //calcular

            return {
                "omnibus_encontrado": true,
                "omnibus_id": omnibusId,
                "distancia": distanciaAlOmnibus
            }
        } else {
            return {
                "omnibus_encontrado": false,
                "distancia": radio * 2
            }
        }
    }).catch(function (error) {
        console.log(error);
    });
}

const obtenerTeaParaLineaYParada = async (linea, parada) => {
    var distanciaDesdeParadaAOmnibus = 0;
    var ominbusFueEncontrado = false;
    var idParada = parada;
    var tea = 0;

    var location = {
        "type": "Point"
    }

    while (!ominbusFueEncontrado) {
        let paradaActual = await obtenerInformacionDeParada(idParada, linea);

        if (idParada === parada) {
            location["coordinates"] = [paradaActual.lat, paradaActual.long]
        }

        let ordinalParadaActual = paradaActual.ordinal;
        let siguienteParada = await obtenerSiguienteParadaDadaLineaYOrdinalDeParada(linea, ordinalParadaActual);

        let coordenadasParadaActual = {
            "lat": paradaActual.lat,
            "lon": paradaActual.long
        };

        let coordenadasSiguienteParada = {
            "lat": siguienteParada.lat,
            "lon": siguienteParada.lon
        };

        let centro = coordenadas.puntoMedio(coordenadasSiguienteParada, coordenadasParadaActual);
        let radio = coordenadas.distancia(coordenadasSiguienteParada, coordenadasParadaActual) / 2;

        const data = await buscarOmnibusDadaLineaUbicacionYRadio(linea, centro, radio);

        const distancia = data["distancia"];

        distanciaDesdeParadaAOmnibus += distancia;

        if (data["omnibus_encontrado"] === true) {
            ominbusFueEncontrado = true;
            const velocidadPromedioOmnibus = calcularVelocidadPromedioDeOmnibus(linea, data["omnibus_id"]);
            tea = (distanciaDesdeParadaAOmnibus / velocidadPromedioOmnibus);
        } else {
            idParada = siguienteParada.codigoParada;
        }
    }

    const data = {
        "linea": linea,
        "parada": parada,
        "location": location,
        "tea": tea
    }

    return data;
}

const obtenerInformacionDeParada = async (codigoParada, linea) => {
    return axios.inst.get(`${externalURL}/api/trayectosporlinea`)
        .then((response) => {
            const trayectos = response.data.trayectos;

            const paradas = _.filter(trayectos, (parada) => {
                return (parada.codigoParada == codigoParada && parada.linea == linea)
            });

            return paradas[0];
        })
        .catch((error) => {
            return null;
        });
}

module.exports = {
    actualizarInfoDeOmnibus: actualizarInfoDeOmnibus,
    calcularVelocidadPromedioDeOmnibus: calcularVelocidadPromedioDeOmnibus,
    nuevosDatosDeOmnibusRecibidos: nuevosDatosDeOmnibusRecibidos,

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

    calcularTeaProximoOmnibus: async (req, res) => {
        try {
            const linea = req.params.id_linea;
            const parada = req.params.id_parada;

            const data = await obtenerTeaParaLineaYParada(linea, parada);

            res.send(data);
        } catch (error) {
            console.log("Error: ", error)
        }
    }
    
}
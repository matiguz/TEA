const axios = require('../helpers/axios');

const orionURL = process.env.API_URL
const observerURL = process.env.SERVER_URL

if (!orionURL) {
    console.log("Please create an .env file in the root folder of the project and set a API_URL var");
    process.exit();
}

if (!observerURL) {
    console.log("Please create an .env file in the root folder of the project and set a SERVER_URL var");
    process.exit();
}

module.exports = {

    inicio: (req,res) => {
        axios.inst({
            method: 'post',
            url: `${orionURL}/v2/subscriptions`,
            data: {
                "subject": {
                    "entities": [{
                        "idPattern": ".*",
                        "type": "Bus",
                    }],

                    "condition": {
                        "attrs": [
                            "location"
                        ]
                    }
                },
                "notification": {
                    "http": {
                        "url": observerURL+"/pruebaSus"
                    },
                    "attrs": [
                        "location",
                        "id",
                        "linea",
                        "timestamp",
                    ]
                }
            }
        }).then((result) => {
            console.log("Se comenzó a escuchar la suscripcion");
            res.send("Subscripcion registrada con éxito.")
        }).catch(function (error) {
            console.log(error);
        });
    },
    fin: (req,res) => {
        const id_subscripcion = req.params.id_subscripcion;
        axios.inst({
            method: 'delete',
            url: `${orionURL}/v2/subscriptions/${id_subscripcion}`,
        }).then ((result) => {
            res.send("Subscripcion eliminada con éxito.")
        });
    }
}
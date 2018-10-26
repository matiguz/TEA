let geoLib = require('geolib');
const axios = require('../helpers/axios');

const externalURL = process.env.API_URL
const observerURL = process.env.SERVER_URL

if (!externalURL) {
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
            url: `${externalURL}:1026/v2/subscriptions`,
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
            console.log("Se comenzó a escuchar la suscripcion")
        }).catch(function (error) {
            console.log(error);
        });
    },

}
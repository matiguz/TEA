const axios = require('axios');

/*CONFIGURO PROXY PARA SALIR DE LA EMPRESA*/
let inst = axios/*.create({
    proxy: {
        host: 'proxysis.corp.ute.com.uy',
        port: 8080,
        auth: {
            username: 'D418342',
            password: 'Matiguz3'
        }
    }
});
*/
exports.inst = inst;
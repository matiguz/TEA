module.exports = {
    calcularTeaProximoOmnibus: (req, res) => {
        const linea = req.params.id_linea;
        const parada = req.params.id_parada;
        const teaEnSegundos = 342;
        const location = {
            "type": "Point",
            "coordinates": [-56.19539, -34.90608]
        }
        
        const data = {
            "linea": linea,
            "parada": parada,
            "location": location,
            "tea": teaEnSegundos
        }

        res.send(data);
    }
}
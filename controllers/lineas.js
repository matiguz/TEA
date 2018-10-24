module.exports = {
    calcularTeaProximoOmnibus: (req, res) => {
        const linea = req.params.id;
        const teaEnSegundos = 342;

        const data = {
            "linea": linea,
            "tea_en_segundos": teaEnSegundos
        }

        res.send(data);
    }
}
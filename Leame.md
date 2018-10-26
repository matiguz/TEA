# TEA

## Indice
* [Introduccion](#introduccion)
* [Prerrequisitos de instalación](#prerrequisitos)
* [Instalación](#instalacion)
* [Servidor de aplicacion](#servidor-aplicacion)
* [Algoritmo](#algoritmo)
* [Decisión de diseño](#decision-de-diseño)



## Introduccion

En el presente documento, se detalla la informacion para realizar le instalacion y ejecucion del programa. tambien se realiza la descripción detallada de todos los componentes de nuestro algoritmo, así mismo, añadiendo también la justificación de cada decisión realizando el análisis correspondiente.

## Prerrequisitos de instalación

* [node](https://nodejs.org/) & [npm](https://www.npmjs.com/#getting-started)

## Instalación

```
$> git clone https://github.com/matiguz/TEA.git
$> cd TEA
$> npm install
```

## Servidor de aplicacion

Para inicializar el servidor de desarrollo abrir la terminal en la carpeta `TEA`  y ejecutar `npm start`. El servidor está disponible en `http://localhost:3001`.

## Algoritmo

La solución creada por nuestro grupo se basa en el cálculo matemático en tiempo real de la velocidad media en tramos pequeños, para luego estimar el tiempo de llegada a la parada del usuario, también tomando en cuenta el tiempo en que tomó el ómnibus en llegar a cada punto geográfico con respecto al punto de partida.

Primero lo que realiza nuestra solución, es detectar el omnibus mas cercano a la parada del usuario y que lógicamente el ómnibus no haya pasado por dicho destino. Para ello lo que se hace es buscar el punto medio del trayecto entre dos paradas empezando desde el ordinal del usuario, y realizando una búsqueda circular y geográfica con el radio medido desde el punto medio hacia una de las paradas, si no se encuentra la línea deseada, se sigue haciendo una búsqueda recursiva hasta llegar al primer ordinal, es decir el origen el omnibus.

Una vez detectado el ómnibus de la línea deseada mas proximo a llegar a la parada, se tiene guardado el cálculo de la velocidad media y el trayecto realizado hasta el momento (tomamos el valor de la velocidad media calculada en tiempo real, cuando un ómnibus inició su recorrido después de 10 minutos, antes de ese tiempo se toma una velocidad media por default de 15 km/h, que es un promedio calculado con toda la información de los ómnibus de viajes anteriores), con este valor lo que hacemos es realizar un cálculo de tiempo teniendo en cuenta la suma de las distancias entre cada ordinal que hay entre el ómnibus y la parada de destino para que sea más preciso el cálculo. Se recomienda utilizar la API en un pull, para actualizar cada vez con más precisión a medida que el ómnibus avanza.

## Decisión de diseño

Se tomó esta decisión ya que analizamos muchas posibilidades y realizamos distintos algoritmos donde fuimos probando los datos del simulador pero también tomamos en cuenta la aplicación de la solución en un escenario real.
Otro algoritmo que estudiamos y analizamos, pero lo descartamos, fue realizar el mismo algoritmo propuesto pero acoplado con un cálculo proveniente de una API proporcionada por Google, la cual te aporta la información de que tan congestionado está un tramo determinado de una calle que uno desee.
Para este tipo de algoritmos en tiempo real, el tiempo de cálculo tiene que ser minimo, ya que el omnibus solamente en un segundo puede moverse bastantes metros y eso ya distorciona el algoritmo. En el uso de APIs externas estamos expuestos a problemas de perfomance y acoplamiento a otras soluciones que pueden tener inconvenientes de servicio.
Realizamos esta API REST pensando en que sea consumida por una aplicacion que se vaya actualizando el tiempo de espera cada vez que se vaya moviendo el omnibus, entonces vamos obteniendo en cada pequeño tramo la velocidad media, por lo que ya tenemos todos los datos necesarios para generar una muy buena estimacion sin necesidad de una API de terceros.




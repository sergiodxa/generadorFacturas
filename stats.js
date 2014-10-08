var colors  = require('colors');
var redis   = require('redis');
var client  = redis.createClient();

function mostrarVeces (data) {
  var mensaje = '';

  for (var persona in data) {
    if (data[persona] == 1) {
      mensaje += colors.green(persona) + " fue " + colors.green(data[persona]) + " vez a comprar facturas.\n";
    } else {
      mensaje += colors.green(persona) + " fue " + colors.green(data[persona]) + " veces a comprar facturas.\n";
    }
  }

  return mensaje;
}

function generarGrafico (data) {
  var grafico = '';

  grafico += colors.bold('               Gráfico:\n');
  grafico += colors.bold('| Nombres         | Columnas\n');
  grafico += colors.bold('|-----------------|---------------\n');

  for (var persona in data) {
    var nombre = persona;

    if (nombre.length < 16) {
      var largo = nombre.length
      var faltan = 16 - largo;

      for (var i = 0; i < faltan; i++) {
        nombre +=  ' ';
      }

      nombre = colors.bold.white('| ') + nombre + colors.bold.white('| ');
    }

    grafico += colors.green.bold(nombre);

    for (var i = 0; i < parseInt(data[persona]); i++) {
      grafico += colors.yellow('=');
    }

    grafico += '\n';
  }

  grafico += colors.bold('|-----------------|---------------\n');

  return grafico
}

client.get('facturasEstadistica', function (err, res) {
  if (err) {
    console.error(err);
  } else {
    var data = JSON.parse(res);

    console.log(mostrarVeces(data).bold);

    console.log(generarGrafico(data));
  }
})
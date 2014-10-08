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

client.get('facturasEstadistica', function (err, res) {
  if (err) {
    console.error(err);
  } else {
    var data = JSON.parse(res);

    console.log(mostrarVeces(data).bold);
  }
})
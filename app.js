var fs         = require('fs');
var nodemailer = require('nodemailer');
var redis      = require('redis');
var client     = redis.createClient();

// mostramos un mensaje de error si no se puede conectar a la base de datos
client.on('error', function (err) {
  console.error(err);
});

// si no existe la llave ultimoComprador en Redis, la creamos con un string de
// un espacio
client.get('ultimoComprador', function (err, res) {
  if (err) {
    console.error(err);
    return;
  } else if (!res) {
    client.set('ultimoComprador', ' ');
  }
});

// si esta seteado la configuración de autenticaçión entonces retornamos el tranporter de nodemailer
function crearTransporter (authData) {
  var defaultData =  {
    'user': 'usuario@dominio.com',
    'pass': 'password'
  };

  if (authData !== defaultData) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth   : authData
    });
  } else {
    return false;
  };
};

// elegimos al candidato y volvemos a comprobar que no sea el que fue por
// última vez
function elegirCandidato (candidatos, callback) {
  var elegido = candidatos[Math.floor(Math.random() * candidatos.length)];

  comprobarUltimo(candidatos, elegido, callback);
};

// retornamos la lista de mails armados de forma que quede:
// "Nombre del receptor <usuario@dominio.com>"
function listarMails (mails) {
  var lista = [];

  for (var i = 0; i < mails.length; i++) {
    lista.push(mails.name + ' <' + mails.mail + '>');
  };

  return lista;
};

// comprobamos que el candidato elegido no sea el último guardado en la base
// de datos o que sea null, si es así lo guardamos en la base de datos y
// ejecutamos un callback regresando al elegido, si no volvemos a realizar el
// sorteo.
function comprobarUltimo (candidatos, elegido, callback) {
  client.get('ultimoComprador', function (err, res) {
    if (err) {
      callback(err);
    } else {
      if (elegido === res.toString()) {
        console.log('El candidato ' + elegido + ' fue la semana pasada, volviendo a sortear...');

        elegirCandidato(candidatos, callback);
      } else if (elegido === null) {
        elegirCandidato(candidatos, callback)
      }  else {
        client.set('ultimoComprador', elegido);

        callback(null, elegido);
      };
    };
  });
};

// leemos el archivo config.json con encode utf-8
fs.readFile(__dirname + '/config.json', 'utf8', function (err, data) {
  if (err) {
    console.error('Error: ' + err);

    return;
  };

  // guardamos en config los datos del archivo config.json parseado
  config = JSON.parse(data);

  // elegimos a quien va a comprar las facturas
  comprobarUltimo(config.candidatos, null, function (err, elegido) {
    if (err) {
      console.error(err);
      return;
    } else {
      // configuramos el transporter de nodemailers
      var transporter = crearTransporter(data.auth);

      if (transporter === false) {
        // armamos la lista de mails
        var mails = listarMails(config.mails);

        // mandamos el mail
        transporter.sendMail({
          from: 'Enviador <usuario@dominio.com>',
          to: mails,
          subject: 'Facturas',
          text: 'Hoy le toca a ' + elegido + ' ir a comprar facturas.'
        }, function(err, info){
          if (err){
            console.error(err);
          } else {
            // si el mensaje se envió correctamente lo indicamos en la pantalla
            console.log('Mensaje enviado: ' + info.response);
            console.log('Hoy le toca a ' + elegido + ' ir a comprar facturas.');
          }
        });
      } else {
        console.log('Hoy le toca a ' + elegido + ' ir a comprar facturas.');
      }
    };
  });
});

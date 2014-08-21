var fs         = require('fs');
var nodemailer = require('nodemailer');

// si esta seteado la configuración de autenticaçión entonces retornamos el tranporter de nodemailer
function crearTransporter (authData) {
  var defaultData =  {
    'user': 'usuario@dominio.com',
    'pass': 'password'
  };

  if (authData === defaultData) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth   : authData
    });
  } else {
    return false;
  };
};

// retornamos al candidato elegido
function elegirCandidato (candidatos) {
  return candidatos[Math.floor(Math.random() * candidatos.length)];
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

// leemos el archivo config.json con encode utf-8
fs.readFile(__dirname + '/config.json', 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);

    return;
  };

  // guardamos en config los datos del archivo config.json parseado
  config = JSON.parse(data);

  // elegimos a quien va a comprar las facturas
  var elegido = elegirCandidato(config.candidatos);

  // configuramos el transporter de nodemailers
  var transporter = crearTransporter(data.auth);

  if (transporter !== false) {
    // armamos la lista de mails
    var mails = listarMails(config.mails);

    transporter.sendMail({
      from: 'Enviador <usuario@dominio.com>',
      to: mails,
      subject: 'Facturas',
      text: 'Hoy le toca a ' + elegido + ' ir a comprar facturas.'
    }, function(err, info){
      if (err){
        console.error(err);
      } else {
        console.log('Mensaje enviado: ' + info.response);
      }
    });
  } else {
    console.log('Hoy le toca a ' + elegido + ' ir a comprar facturas.');
  }
});

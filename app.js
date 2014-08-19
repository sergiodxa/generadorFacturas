var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'usuario@dominio.com',
        pass: 'password'
    }
});

// candidadots a ir a comprar facturas
var candidatos = [
  'Opción 1',
  'Opción 2'
];

// elegido
var elegido = candidatos[Math.floor(Math.random() * candidatos.length)];

// mostramos en la consola el elegido
console.log('Elegido: ' + elegido);

// mails a los que se va a avisar
var mails = [
  'Receptor 1 <usuario@dominio.com>',
  'Receptor 2 <usuario@dominio.com>'
];

// Opciones del mail
var mailOptions = {
    from: 'Enviador <usuario@dominio.com>',
    to: mails,
    subject: 'Facturas',
    text: 'Hoy le toca a ' + elegido + ' ir a comprar facturas.'
};

// Enviar mail
transporter.sendMail(mailOptions, function(error, info){
  if (error){
    console.log(error);
  } else {
    console.log('Mensaje enviado: ' + info.response);
  }
});

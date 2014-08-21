# Sorteo para facturas

Script de sorteo para ver quién va a comprar facturas, incluyendo un aviso por mail.

## Instalación

Para instalar el script hay que ejecutar el comando:

```
npm install
```

## Funcionamiento:

La aplicación se configura en config.json, dentro de este archivo configuramos los datos de autenticación para enviar el mail, la lista de candidatos y la lista de receptores del aviso. El archivo tiene el siguiente formato

```javascript
{
  "auth": {
    "user": "usuario@dominio.com",
    "pass": "password"
  },
  "candidatos": [
    "Candidato 1",
    "Candidato 2"
  ],
  "mails": [
    {
      "name": "Receptor 1",
      "mail": "usuario@dominio.com"
    },
    {
      "name": "Receptor 1",
      "mail": "usuario@dominio.com"
    }
  ]
}
```

En ''auth'' se configura el usuario y la contraseña del mail de gmail desde el cual se va a enviar el mail de aviso. Si se dejan los valores por defecto en vez de enviar un mail se imprime el candidato elegido en la consola.

En candidatos se coloca una lista con los nombres de los posibles candidatos.

En mails se deja la lista de receptores, cada receptor en un objeto de javascript con las propiedades ''name'' para el nombre del receptor y ''mail'' para el email del receptor.

Una vez configurado todo se ejecuta el script usando el comando
```
npm start
```

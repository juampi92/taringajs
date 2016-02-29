[![npm version](https://badge.fury.io/js/taringajs.svg)](http://badge.fury.io/js/taringajs) [![GitHub version](https://badge.fury.io/gh/overjt%2Ftaringajs.svg)](http://badge.fury.io/gh/overjt%2Ftaringajs)

#TaringaJS

Taringa + nodejs


Para instalar en su proyecto:
```bash

npm install taringajs --save

```
##Ejemplos
Todos los ejemplos tienen el siguiente encabezado
```javascript
var t = require('taringajs');
var taringa = new t('USERNAME', 'PASSWORD');
```

###Hacer un Shout
* Texto
```javascript
taringa.shout.add("Test - #NodeJS");
```
* Imagen
```javascript
taringa.shout.add("Test image", 1, 0, "http://k33.kn3.net/taringa/9/2/3/6/7/8//djtito08/9B4.jpg"); //La url debe ser de kn3
```
* Video
```javascript
taringa.shout.add("Test video", 2, 0, "https://www.youtube.com/watch?v=l7Fi8-7HRhc");
```
* Link
```javascript
taringa.shout.attach_link("http://coffeescript.org/", function(err, data) {
  if (err) {
    return console.log(err);
  }
  return taringa.shout.add("Test link", 3, 0, data);
});
```

###Comentar un shout
```javascript
taringa.shout.add_comment("Hola",60544255,19963011,"shout");
```

###Dar "Me gusta" a un shout
```javascript
taringa.shout.like(60544255,19963011);
```

###Dar "Reshout" a un shout
```javascript
taringa.shout.reshout(60544255,19963011); // shout_id, shout_owner_id
```

###Obtener los datos de un shout utilizando el id
```javascript
taringa.shout.get(60544255, function(err, data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);
});
```

###Importar una imagen a kn3
```javascript
taringa.kn3.import("https://i.imgur.com/s8yBeZ8.png", function(err, data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);
});
```

###Obtener los datos de un usuario según el nick
```javascript
taringa.user.getUserFromNick("overjt", function(err, data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);
});
```

###Seguir a un usuario
```javascript
taringa.user.follow(19963011);
```

###Dejar de seguir a un usuario
```javascript
taringa.user.unfollow(19963011);
```

###Dar favorito a un shout
```javascript
taringa.shout.fav(60544255,19963011);
```


###Obtener el último MP
```javascript
taringa.message.getLast(function(err, data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);
});
```

###Obtener un MP por ID
```javascript
taringa.message.get(1324344, function(err, data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);
});
```
Todos los ejemplos están en el archivo `test/test.js`

###Crear un post


```javascript

var options = {
    title: 'Posteo algo y te lo muestro',
    body: "[img]https://k60.kn3.net/taringa/9/5/0/0/6/4//xxx_555/BA9.jpg[/img]",
    category: 1,
    tags: "imagenes, gif, random, taringa",
    //el thumbnail debe ser una imagen de kn3
    thumbnail: "https://k60.kn3.net/taringa/9/5/0/0/6/4//xxx_555/BA9.jpg"
};

taringa.post.create(options);
                        

```
##TESTING

Para correr los tests, hacer
```bash

USER=user:passwprd npm test

```

Cuidado que los tests se corren sobre el usuario seleccionado. Por ahora son sólo GET, pero cuando se hagan los POSTS, también se harán los DELETE para que no quede rastro.

##DOCUMENTACION

Para generar la documentación, correr
```bash

npm run doc

```

Generará una carpeta con una página estática en la carperta /doc con la documentación de la API.


##TODO


* Migrar a Taringa API: [http://api.taringa.net/docs/taringa/methods/home.html](docs)
* Pasar a usar Promesas en vez de callbacks
* Mejorar el motor de log
* Mejorar la API de algunos metodos
* Constantes para Categorias y tipos de Shouts
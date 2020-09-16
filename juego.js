//LISTENERS
//Evento para que cuando se presione la barra espaciadora, salte nuestro personaje
document.addEventListener("keydown", function (evento) {
  if (evento.keyCode == 32) {
    if (nivel.muerto == false) {
      saltar();
    } else {
      nivel.velocidad = 7;
      nube.velocidad = 0.3;
      nivel.muerto = false;
      roca.x = ancho + 100;
      dragon.x = ancho + 500;
      nube.x = ancho + 100;
      nivel.marcador = 0;
    }
  }
});

//dimensiones del canvas
var ancho = 800;
var alto = 450;
var ctx;
//Cargar imagenes
var imgNinja, imgNube, imgRoca, imgFondo, imgDragon;
function cargaImagenes() {
  imgNinja = new Image();
  imgNube = new Image();
  imgRoca = new Image();
  imgFondo = new Image();
  imgDragon = new Image();

  imgNinja.src = "img/ninja.png";
  imgNube.src = "img/nube.jpg";
  imgRoca.src = "img/roca.png";
  imgFondo.src = "img/fondo.png";
  imgDragon.src = "img/dragon.png";
}

////////////////////////
//PROPIEDADES
var suelo = 300;
var ninja = {
  y: suelo, // eje vertical de la ninja
  vy: 0, // velocidad vertical
  gravedad: 2,
  salto: 28, //los pixeles que subira de golpe al principio
  vymax: 9, //velocidad maxima a la que vaya, para que no se acelere hasta el infinito
  saltando: false, //si la ninja esta en el aire se aplica gravedad, sino, no
  agachada: false,
};
var nivel = {
  velocidad: 7, //vel del suelo y la roca
  marcador: 0,
  muerto: false,
};
var roca = {
  x: ancho + 100, //no se va a ver el inicio, le damos la anchura del canvas + 100px mas para que no se vea
  y: suelo + 40,
};
var dragon = {
  x: ancho + 700,
  y: suelo - 200,
};
var nube = {
  x: 0,
  y: 0,
  velocidad: 0.3,
};
var fondo = {
  x: 0,
  y: 0,
};
/////////////////////////////////
//MOSTRAR EN PANTALLA LOS ELEMENTOS A INTERACTUAR
//ninja aparece en acccion
function dibujaNinja() {
  //los primeros dos parametros son del contexto
  //los 2dos parametros son el tamaño real de la imagen del ninjasauro 40 de ancho x 43 de alto
  //los 3ros parametros son donde se va a posicionar el ninja
  //con que tamaño queremos que aparesca el ninja si queremos rescalarlo

  ctx.drawImage(imgNinja, 0, 0, 125, 106, 100, ninja.y, 125, 106);
}
//roca en accion
function dibujaRoca() {
  ctx.drawImage(imgRoca, 0, 0, 143, 77, roca.x, roca.y, 143, 77);
}
// dragon en accion
function dibujaDragon() {
  ctx.drawImage(imgDragon, 0, 0, 220, 113, dragon.x, dragon.y, 220, 113);
}
//Suelo en acccion
function dibujaSuelo() {
  ctx.drawImage(imgFondo, fondo.x, 0, 800, 450, 0, fondo.y, 800, 450);
}
//Nube en accion
function dibujaNube() {
  ctx.drawImage(imgNube, nube.x, 0, 800, 450, 0, nube.y, 800, 450);
}

///////////////////////////
//Logica del roca
function logicaRoca() {
  //aparece por la pantalla, se mueve a la velocidad del nivel y
  //cuando pase la posicion de 0 (salga de pantalla izq)
  //se actualizara para que vuelva a aparecer por la derecha
  if (roca.x < -100) {
    roca.x = ancho + 100;
    nivel.marcador++;
    nivel.velocidad++;
  } else {
    roca.x -= nivel.velocidad;
  }
}

//Logica NUBE
function logicaNube() {
  if (nube.x > 800) {
    nube.x = 0;
  } else {
    nube.x += nivel.velocidad;
  }
}
//Logica SUELO
function logicaSuelo() {
  if (fondo.x > 800) {
    fondo.x = 0;
  } else {
    fondo.x += nivel.velocidad;
  }
}
//agachar personaje
function agachar() {
  if (ninja.agachada == false) {
    dibujaNinjaAbajo();
    ninja.agachada = true;
  }
}
//Activamos y desactivamos el salto del ninja
function saltar() {
  if (ninja.saltando == false) {
    ninja.vy = ninja.salto;

    ninja.saltando = true;
  }
}

//Aplicamos la gravedad del salto al ninja cuando esta en el aire
function gravedad() {
  if (ninja.saltando == true) {
    //para que el ninja no pase del suelo
    if (ninja.y - ninja.vy - ninja.gravedad > suelo) {
      ninja.saltando = false;
      ninja.vy = 0;
      ninja.y = suelo;
    } else {
      //sino implementa la gravedad
      ninja.vy -= ninja.gravedad;
      ninja.y -= ninja.vy;
    }
  }
}

//LA COLISION
function colision() {
  if (roca.x >= 100 && roca.x <= 150) {
    if (ninja.y >= suelo - 25) {
      nivel.muerto = true;
      nivel.velocidad = 0;
      nube.velocidad = 0;
    }
  }
  if (dragon.x >= 100 && dragon.x <= 150) {
    if (ninja.y >= suelo - 25) {
      nivel.muerto = true;
      nivel.velocidad = 0;
      nube.velocidad = 0;
    }
  }
}

// PUNTUACION
function puntuacion() {
  ctx.font = "38px impact";
  ctx.fillStyle = "white  ";
  ctx.fillText(`${nivel.marcador}`, 700, 70);
  if (nivel.muerto == true) {
    ctx.font = "100px impact";
    ctx.fillText(`GAME OVER `, 200, 200);
    ctx.font = "30px impact";
    ctx.fillText(`(Presione la barra para reiniciar) `, 219, 240);
  }
}
////////////////////////////////////

// para que el canvas inicie
function inicializa() {
  canvas = document.getElementById("canvas");
  //le decimos como se va a ver el entorno
  ctx = canvas.getContext("2d");
  //aca es donde estan cargadas las imagenes del ninja, roca,etc
  cargaImagenes();
}

function borraCanvas() {
  canvas.width = ancho;
  canvas.height = alto;
}

// BUCLE PRINCIPAL
var FPS = 50;
//cuantos - fps, mas lento,
//cuantos + fps, mas rapido
//Cada cuanto tiempo se tiene que ejecutar la funcion princiapl
setInterval(function () {
  principal();
}, 1000 / FPS);

//aca es donde se va a ir dibujando a la ninja, el fondo, ls roca, las nubes,etc
//en la posicion que le corresponda en cada momento
//la func principal es la que va a reunir a todas las acciones del juego
function principal() {
  borraCanvas();
  gravedad();
  colision();
  logicaSuelo();
  logicaRoca();
  logicaNube();
  dibujaNube();
  dibujaSuelo();
  dibujaRoca();
  dibujaDragon();
  dibujaNinja();
  puntuacion();
}

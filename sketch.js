let video;
let featureExtractor;
let knn;

let labelP;

let started = false; 

function knnLoaded() {
  started = true;
    // 5: Clasifica nuevas imagenes
  let features = featureExtractor.infer(video);
  knn.classify(features, gotResult);     
  
}

function modelReady() {
  console.log('model ready');
}

function setup() {
  createCanvas(320, 240);
  video = createCapture(VIDEO);
  // 1: Carga MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  // 2: crea KNN clasificador
  knn = ml5.KNNClassifier();
  // 3: Carga datos de entrenamiento existentes (opcional)
  knn.load('./piedrapapeltijera.json', knnLoaded);
  video.size(320, 240);
  video.hide();
  labelP = createP('No ha empezado el entrenamiento');
  labelP.style('font-family', 'Helvetica');
  labelP.style('font-size', '32pt');
  
  
}

// 5: clasifica nuevas imagenes
// PREDICION (aka inference. . . guessing. . .)
function gotResult(error, results) {
  if (error) {
    console.error(error);
  } else {
    console.log(results);
    labelP.html(results.label);
    let features = featureExtractor.infer(video);
    knn.classify(features, gotResult);     
  }
}


// Entrenamiento
function keyPressed() {
  let features = featureExtractor.infer(video);
  
  // 4: Agrega nuevos datos de entrenamiento
  if (key == 'c') {
    knn.addExample(features, 'Piedra');
    console.log('Agrego un ejemplo de Piedra');
  } else if (key == 'd') {
    knn.addExample(features, 'Papel');
    console.log('Agrego un ejemplo de papel');
  }
	else if (key == 'f') {
    knn.addExample(features, 'Tijera');
    console.log('Agrego un ejemplo de papel');
  } 
  else if (key == 's') {
    knn.save('piedrapapeltijera');
  }
  // } else if (key == ' ') {
  //   knn.classify(features, gotResult); 
  // }
    
  if (knn.getNumLabels() !== 0 && !started) {
    started = true;
    // 5: Clasificaa nuevas imagenes 
    knn.classify(features, gotResult);     
  }
}

function draw() {
  background(220);
  image(video, 0, 0);
}
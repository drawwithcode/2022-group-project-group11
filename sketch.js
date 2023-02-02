const translate_api_endpoint = "https://api.cognitive.microsofttranslator.com";
let translate_api_key = "fabd1ff9c0e94348ab8e9dcbb0c28444";
const translate_version = "3.0";
const translate_region = "switzerlandnorth";

async function microsoft_translate(source_text, source_language, target_language) {
  const endpoint = `${translate_api_endpoint}/translate?api-version=${translate_version}&from=${source_language}&to=${target_language}`; // Constructing the URL to send to
  const data_body = [{text: source_text}]; // Constructing the data to be sent
  const response = await fetch(endpoint, {
    method: "POST", // We will use POST to send this data to the end point
    mode: "cors", // CORS is a security feature that only allows requests to/from the same site, in this case because we're sending data to an external site we will turn it off
    cache: "no-cache", // We will disable caching so that we will always get the "fresh" response from the server
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": translate_api_key,
      "Ocp-Apim-Subscription-Region": translate_region,
    },
    body: JSON.stringify(data_body),
  });
  return response.json(); // parse json response into a javascript object and return
}

let frame = 0,
  control = false,
  open = false,
  translatedPhrases = [],
  analysis,
  phrase;

function nextFrame() {
  if (frame == 0) {
    document.getElementById("intro").style.display = "none";
    document.getElementById("instructions").style.visibility = "visible";
    frame++;
  } else if (frame == 1) {
    document.getElementById("instructions").style.display = "none";
    document.getElementById("legenda").style.visibility = "visible";
    frame++;
  } else if (frame == 2) {
    document.getElementById("legenda").style.visibility = "hidden";
    document.getElementById("speech").style.visibility = "visible";
    console.log(frame);
    frame++;
  } else if (frame == 3) {
    document.getElementById("speech").style.visibility = "hidden";
    document.getElementById("confermation").style.visibility = "visible";
    frame++;
  } else if (frame == 4) {
    document.getElementById("confermation").style.display = "none";
    document.getElementById("map").style.visibility = "visible";
    frame++;
  } else if (frame == 5) {
    console.log(frame);
    document.getElementById("map").style.visibility = "hidden";
    document.getElementById("start").style.display = "none";
    document.getElementById("translation").style.visibility = "visible";
    document.getElementById("animation").style.visibility = "visible";
    frame++;
  } else if (frame == 6) {
    document.getElementById("translation").style.display = "none";
    document.getElementById("animation").style.display = "none";
    document.getElementById("map").style.visibility = "visible";
    frame++;
    console.log(frame);
  } else if (frame == 7) {
    document.getElementById("map").style.visibility = "hidden";
    document.getElementById("reverse").style.visibility = "visible";
    frame++;
  } else if (frame == 8) {
    document.getElementById("reverse").style.visibility = "hidden";
    document.getElementById("recap").style.visibility = "visible";
  }
}

function oldFrame() {
  if (frame == 4) {
    control = false;
    document.getElementById("confermation").style.visibility = "hidden";
    document.getElementById("speech").style.visibility = "visible";
    frame = frame - 1;
  }
}

function openLegend() {
  if (open == false) {
    open = true;
    document.getElementById("translationAnimation").style.visibility = "hidden";
    document.getElementById("legenda").style.visibility = "visible";
    document.getElementById("info").innerHTML = "Close";
  } else {
    open = false;
    document.getElementById("translationAnimation").style.visibility = "visible";
    document.getElementById("legenda").style.visibility = "hidden";
    document.getElementById("info").innerHTML = "Legend";
  }
}

var recordSketch = function (sketch) {
  let maxDiameter = 100,
    beta = 0,
    startingD = 300,
    startingD1 = 150,
    clicked = false,
    bg;

  sketch.preload = function () {
    bg = sketch.loadImage("/assets/background.png");
  };

  sketch.setup = function () {
    let canvasRecord = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    canvasRecord.parent("speech");
    sketch.textAlign(sketch.CENTER);
    sketch.rectMode(sketch.CENTER);
    sketch.noStroke();
    sketch.angleMode(sketch.RADIANS);
    sketch.speechRec = new p5.SpeechRec("en-US", sketch.gotSpeech);
    canvasRecord.mouseClicked(sketch.recording);
  };

  sketch.draw = function () {
    sketch.background(bg);
    sketch.fill("#BADCE6");
    sketch.ellipse(sketch.width / 2, sketch.height / 2, startingD, startingD);
    sketch.fill("#6AA5A9");
    sketch.ellipse(sketch.width / 2, sketch.height / 2, startingD1, startingD1);
    if (clicked == true) {
      startingD = 325 + sketch.sin(beta) * maxDiameter;
      beta += 0.03;
    } else {
      startingD = 300;
      startingD1 = 200;
    }
    sketch.fill("white");
    sketch.textFont("Montserrat");
    sketch.textSize(40);
    sketch.text("Speak loud and clear", sketch.width / 2, sketch.height / 5);

    sketch.push();
    sketch.textStyle("bold");
    sketch.textFont("Montserrat");
    sketch.textSize(40);
    sketch.text("Press", sketch.width / 2, sketch.height / 2 + 15);
    sketch.pop();
  };

  sketch.recording = function () {
    if (frame == 3 && control == false) {
      control = true;
      clicked = true;
      sketch.speechRec.start();
      console.log("apro lo sketch");
    }
  };

  sketch.gotSpeech = function () {
    if (sketch.speechRec.resultValue) {
      let said = sketch.speechRec.resultString;
      if (said.length <= 7) {
        phrase = said;
      } else {
        phrase = said.split(" ").splice(0, 7).join(" ");
      }
      console.log(phrase);
      analysis = RiTa.pos(phrase);
      clicked = false;
      console.log(analysis);

      document.getElementById("phrase").innerHTML = phrase;
      document.getElementById("starting").innerHTML = phrase;
      translatedPhrases.push(phrase);
      nextFrame();
      //gliene metto alcune solo per simulare come sarà
    }
  };
};

new p5(recordSketch);

let langs = ["en", "en", "en", "en", "en"];

var languageSketch = function (sketch) {
  let map;

  let csels = [75, 450, false];
  let cselsa = [150, 625, false];
  let cseleu = [325, 425, false];
  let cselaf = [375, 600, false];
  let cselas = [575, 475, false];

  let route = ["sels"];
  let places = {
    0: "English",
    1: "English",
    2: "English",
    3: "English",
    4: "English",
  };

  let current = [csels[0], csels[1]];
  let next = [csels[0], csels[1]];

  let order = 0;

  sketch.preload = function () {
    map = sketch.loadImage("assets/map.png");
  };

  sketch.setup = function () {
    let canvasLanguage = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    canvasLanguage.parent("map");
    sketch.background(map);
    sketch.textAlign(sketch.CENTER);
    console.log("crea la canvas");

    let sels = sketch.createSelect();
    sels.parent("map");
    sels.position(csels[0], csels[1]);
    sels.option("English");

    console.log("crea un select");

    let selsa = sketch.createSelect();
    selsa.parent("map");
    selsa.position(cselsa[0], cselsa[1]);
    selsa.option("---");
    selsa.option("Spanish");
    selsa.option("Portuguese");
    selsa.option("French");
    selsa.option("Dutch");
    selsa.selected("---");

    selsa.changed(function () {
      next = [cselsa[0], cselsa[1]];

      if (cselsa[2] == false) {
        cselsa[2] = true;
        sketch.append(route, "selsa");

        cselsa[3] = order + 1;
        places[order + 1] = selsa.value();
      } else if (csels[2] == false) {
        places[cselsa[3]] = selsa.value();
      }

      sketch.mySelect();
      selsa.disable("---");
    });

    let seleu = sketch.createSelect();
    seleu.parent("map");
    seleu.position(cseleu[0], cseleu[1]);
    seleu.option("---");
    seleu.option("Italian");
    seleu.option("German");
    seleu.option("Greek");
    seleu.option("Russian");
    seleu.selected("---");

    seleu.changed(function () {
      next = [cseleu[0], cseleu[1]];

      if (cseleu[2] == false) {
        cseleu[2] = true;
        sketch.append(route, "seleu");

        cseleu[3] = order + 1;
        places[order + 1] = seleu.value();
      } else if (csels[2] == false) {
        places[cseleu[3]] = seleu.value();
      }

      sketch.mySelect();
      seleu.disable("---");
    });

    let selaf = sketch.createSelect();
    selaf.parent("map");
    selaf.position(cselaf[0], cselaf[1]);
    selaf.option("---");
    selaf.option("Arabic");
    selaf.option("Afrikaans");
    selaf.option("Swahili (Latin)");
    selaf.option("Zulu");
    selaf.selected("---");

    selaf.changed(function () {
      next = [cselaf[0], cselaf[1]];

      if (cselaf[2] == false) {
        cselaf[2] = true;
        sketch.append(route, "selaf");

        cselaf[3] = order + 1;
        places[order + 1] = selaf.value();
      } else if (csels[2] == false) {
        places[cselaf[3]] = selaf.value();
      }

      sketch.mySelect();
      selaf.disable("---");
    });

    let selas = sketch.createSelect();
    selas.parent("map");
    selas.position(cselas[0], cselas[1]);
    selas.option("---");
    selas.option("Chinese");
    selas.option("Hindi");
    selas.option("Japanese");
    selas.option("Indonesian");
    selas.selected("---");

    selas.changed(function () {
      next = [cselas[0], cselas[1]];

      if (cselas[2] == false) {
        cselas[2] = true;
        sketch.append(route, "selas");

        cselas[3] = order + 1;
        places[order + 1] = selas.value();
      } else if (csels[2] == false) {
        places[cselas[3]] = selas.value();
      }

      sketch.mySelect();
      selas.disable("---");
    });

    button = sketch.createButton("Start");
    button.id("start");
    button.parent("map");
    button.position(sketch.width / 2 - button.width / 2, sketch.height - 250);
    button.mousePressed(function () {
      if (order >= 4 && csels[2] == false) {
        csels[2] = true;
        nextFrame();
        // getElementById("language1").innerHTML = places[4];
        // getElementById("phrase1").innerHTML = translatedPhrases[5];
        // getElementById("phrase2").innerHTML = translatedPhrases[0];
        sketch.confirm();
      }

      if (csels[2] == true) {
        if (route[1] == "selsa" || route[2] == "selsa" || route[3] == "selsa") {
          selsa.hide();
        }

        if (route[1] == "seleu" || route[2] == "seleu" || route[3] == "seleu") {
          seleu.hide();
        }

        if (route[1] == "selaf" || route[2] == "selaf" || route[3] == "selaf") {
          selaf.hide();
        }

        if (route[1] == "selas" || route[2] == "selas" || route[3] == "selas") {
          selas.hide();
        }
      }
    });
  };
  sketch.draw = function () {};

  sketch.mySelect = function () {
    if (order < 4) {
      sketch.arrow();
    }
  };

  sketch.arrow = function () {
    order++;
    let curve = 50;
    if (order % 2 == 0) {
      curve = -50;
    }

    sketch.push();
    sketch.noFill();
    sketch.strokeWeight(4);
    sketch.stroke(255, 255, 255);
    sketch.drawingContext.setLineDash([5, 10]);
    sketch.bezier(
      current[0] + 40,
      current[1] + 10,
      sketch.lerp(current[0], next[0], 0.25) + curve,
      sketch.lerp(current[1], next[1], 0.25) + curve,
      sketch.lerp(current[0], next[0], 0.75) + curve,
      sketch.lerp(current[1], next[1], 0.75) + curve,
      next[0] + 40,
      next[1] + 10
    );
    sketch.pop();

    current = [next[0], next[1]];
  };

  sketch.confirm = function () {
    sketch.clear();
    sketch.background(map);

    next = [csels[0], csels[1]];

    let curve = 50;

    if (order % 2 == 0) {
      curve = -50;
    }

    sketch.push();
    sketch.noFill();
    sketch.strokeWeight(4);
    sketch.stroke(255, 255, 255);
    sketch.drawingContext.setLineDash([5, 10]);
    sketch.bezier(
      current[0],
      current[1],
      sketch.lerp(current[0], next[0], 0.25) + curve,
      sketch.lerp(current[1], next[1], 0.25) + curve,
      sketch.lerp(current[0], next[0], 0.75) + curve,
      sketch.lerp(current[1], next[1], 0.75) + curve,
      next[0],
      next[1]
    );
    sketch.pop();

    for (let i = 1; i < 5; i++) {
      if (places[i] == "Spanish") {
        langs[i] = "es";
      } else if (places[i] == "Portuguese") {
        langs[i] = "pt";
      } else if (places[i] == "French") {
        langs[i] = "fr";
      } else if (places[i] == "Dutch") {
        langs[i] = "nl";
      } else if (places[i] == "Italian") {
        langs[i] = "it";
      } else if (places[i] == "German") {
        langs[i] = "de";
      } else if (places[i] == "Greek") {
        langs[i] = "el";
      } else if (places[i] == "Russian") {
        langs[i] = "ru";
      } else if (places[i] == "Arabic") {
        langs[i] = "ar";
      } else if (places[i] == "Afrikaans") {
        langs[i] = "af";
      } else if (places[i] == "Swahili (Latin)") {
        langs[i] = "sw";
      } else if (places[i] == "Chinese simpl") {
        langs[i] = "zh-Hans";
      } else if (places[i] == "Hindi") {
        langs[i] = "hi";
      } else if (places[i] == "Japanese") {
        langs[i] = "ja";
      } else if (places[i] == "Indonesian") {
        langs[i] = "id";
      }
    }
    console.log(langs);
    console.log(places);
  };
};

new p5(languageSketch);

var translationSketch = function (sketch) {
  let shapes = [],
    alpha = 10,
    h = 30,
    colore = false,
    opacity = 1,
    opacity2 = 1,
    comment = false,
    translated = 0;
  sketch.setup = function () {
    let canvasTranslation = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    canvasTranslation.parent("animation");
    let base = document.getElementById("analized").innerHTML;
    for (let i = 1; i < 5; i++) {
      console.log("sono nel for mamma");
      microsoft_translate(translatedPhrases[i - 1], langs[i - 1], langs[i]).then((data) => {
        console.log("sto traducendomi mamma");
        const result = data[0]["translations"][0]["text"];
        translatedPhrases.push(result);
      });
    }
  };

  console.log(translatedPhrases);
  // words = translatedPhrases[0].split(" ");
  // console.log(words);
  // for (let i = 0; i < words.length; i++) {
  //   shapes.push(new Shape(base.getBoundingClientRect().x, base.getBoundingClientRect().y, sketch.textWidth(words[i]), analyze[i]));
  //   console.log(shapes);
  // // }
  // noStroke();
};
sketch.draw = function () {
  if (opacity <= 300) {
    for (let k = 0; k < shapes.length; k++) {
      shapes[k].create();
    }
    opacity++;
  } else if (h < 60) {
    alpha = 255;
    for (let l = 0; l < shapes.length; l++) {
      shapes[l].create();
    }
    h++;
    //al posto di 60 metto l'altezza per 2
    document.getElementById("comments").innerHTML = "Adding a context to each word";
  } else if (opacity2 <= 255) {
    alpha = 10;
    colore = true;
    setTimeout(function () {
      for (let n = 0; n < shapes.length; n++) {
        shapes[n].create();
      }

      opacity2++;
      document.getElementById("comments").innerHTML = "Categorizing each word";
    }, 2000);
  } else if (translated < translatedPhrases.lenght) {
    setTimeout(function () {
      getElementById("language").innerHTML = languageNames;
      getElementById("translated").innerHTML = translatedPhrases[translated];
      translated++;
    }, 3000);
  } else {
    nextFrame();
  }
};

class Shape {
  constructor(posX, posY, size, category) {
    this.x = posX;
    this.y = posY;
    this.w = size;
    this.c = category;
  }

  create() {
    if (colore == false) {
      sketch.fill(255, 255, 255, alpha);
      if (colore == true) {
        if (this.c == "cd") {
          sketch.fill(191, 184, 224, alpha);
        } else if (this.c == "dt") {
          sketch.fill(227, 210, 161, alpha);
        } else if (this.c == "jj" || this.c == "jjr" || this.c == "jjs") {
          sketch.fill(220, 151, 175, alpha);
        } else if (this.c == "nn" || this.c == "nns" || this.c == "nnp" || this.c == "nnps") {
          sketch.fill(187, 214, 177, alpha);
        } else if (this.c == "prp" || this.c == "prp$") {
          sketch.fill(224, 174, 140, alpha);
        } else if (this.c == "rb" || this.c == "rbr" || this.c == "rbs") {
          sketch.fill(200, 204, 204, alpha);
        } else if (this.c == "vb" || this.c == "vbd" || this.c == "vbg" || this.c == "vbn" || this.c == "vbp" || this.c == "vbz") {
          sketch.fill(186, 220, 230, alpha);
        } else {
          sketch.fill(230, 199, 221, alpha);
        }
      }
      sketch.rect(this.x, this.y, this.w, h, 7);
    }
  }
}

new p5(translationSketch);

let isActive = false;
let intensity = 5;
let flickering = false; 
let canvas, ctx;


chrome.storage.sync.get(["vssActive", "vssIntensity", "flickering"], (data) => {
  if (data.vssActive) {
    isActive = true;
    intensity = data.vssIntensity || 5;
    flickering = data.flickering || false;
    startVisualSnow();
  }
});


chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "toggleEffect") {
    isActive = !isActive;
    chrome.storage.sync.set({ vssActive: isActive });
    if (isActive) {
      startVisualSnow();
    } else {
      removeVisualSnow();
    }
  }

  if (message.action === "setIntensity") {
    intensity = message.value;
    chrome.storage.sync.set({ vssIntensity: intensity });
    updateVisualSnow();
  }

  
});

function startVisualSnow() {
  if (document.getElementById("visualSnowCanvas")) return; // makes sure it doesnt run over itself

  // this should create the canvas overlay 
  canvas = document.createElement("canvas");
  canvas.id = "visualSnowCanvas";

  Object.assign(canvas.style, {
    position: "fixed", 
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    pointerEvents: "none", // gotta make sure the page is still useable lol
    zIndex: "999999", // i wonder how high i could set it
    display: "block",
  });

  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");

  // the start of pain
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  generateNoise();
}

function resizeCanvas() {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}

function generateNoise() {
  if (!isActive) return; 

  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const val = Math.random() * 255;
    pixels[i] = val; 
    pixels[i + 1] = val; 
    pixels[i + 2] = val; 
    pixels[i + 3] = Math.min(intensity * 25, 180); 
  }

  ctx.putImageData(imageData, 0, 0);
  requestAnimationFrame(generateNoise); // should make it loop smoothly (whatever smooth is in vss)
}

function updateVisualSnow() {
  if (canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const val = Math.random() * 255;
      pixels[i] = val;
      pixels[i + 1] = val;
      pixels[i + 2] = val;
      pixels[i + 3] = Math.min(intensity * 25, 100); 
    }

    ctx.putImageData(imageData, 0, 0);
  }
}





function removeVisualSnow() {
  const canvas = document.getElementById("visualSnowCanvas");
  if (canvas) {
    canvas.remove();
    window.removeEventListener("resize", resizeCanvas);
  }
}




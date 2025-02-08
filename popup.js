//this is for the base snow
const snowButton = document.getElementById("toggle");
let isSnowing = false;

snowButton.addEventListener("click", () => {
  isSnowing = !isSnowing; 
  if (isSnowing) {
    snowButton.innerText = "Disable Snow";
  } else {
    snowButton.innerText = "Enable Snow";
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "toggleEffect" });
  });
});

  document.getElementById("intensity").addEventListener("input", (event) => {
    let intensity = event.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "setIntensity", value: intensity });
    });
  });


//This is for the flickering button, sends the message and also changes the text (or at least it should)
const flickerButton = document.getElementById('flickerToggle');
let isFlickering = false;

flickerButton.addEventListener('click', () => {
  isFlickering = !isFlickering;

  if (isFlickering) {
    flickerButton.innerText = 'Disable Flickering';
  } else {
    flickerButton.innerText = 'Enable Flickering';
  }

  chrome.runtime.sendMessage({
    action: 'toggleFlicker',
  });
});

document.getElementById('flickerIntensitySlider').addEventListener('input', (event) => {
    const intensityValue = event.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "setFlickerIntensity", value: intensityValue });
    });
  });
  

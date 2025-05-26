  let monthlyRecycle = parseInt(localStorage.getItem("monthlyRecycle")) || 0;
  let monthlyGoal = parseInt(localStorage.getItem("goal")) || 10;


  const URL = "https://teachablemachine.withgoogle.com/models/Q0vMyAAez/";
  const feedback = [
    "PET 1 - Can be recycled at curbside or your local recycling center",
    "HDPE 2 - Can be recycled at curbside or your local recycling center. Lids may be replaced.",
    "PVC 3 - These are generally not recyclable. If you wish to recycle it, check with your local recycling center.",
    "LDPE 4 - These are generally not recyclable. If you wish to recycle it, check with your local recycling center.",
    "PP 5 - These are generally recyclable.",
    "PS 6 - These are generally not recyclable. If you wish to recycle it, check with your local recycling center.",
    "Other 7 - These are generally not recyclable. If you wish to recycle it, check with your local recycling center.",
  ];

  let model, webcam, labelContainer, maxPredictions;
  let isLooping = true;

  function indexOfMax(arr) {
    if (arr.length === 0) return -1;
    let maxIndex = 0;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > arr[maxIndex]) {
        maxIndex = i;
      }
    }
    return maxIndex;
  }

  async function init() {
    isLooping = true;
    document.getElementById("webcam-container").innerHTML = "";
    document.getElementById("text").innerHTML = "";
    document.getElementById("capture-btn").style.display = "inline-block";

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    document.getElementById("loader").style.display = "block";
    document.getElementById("text").innerHTML = "Loading...";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    document.getElementById("loader").style.display = "none";

    webcam = new tmImage.Webcam(200, 200, false);
    await webcam.setup({ facingMode: "environment" });
    await webcam.play();

    document.getElementById("webcam-container").appendChild(webcam.canvas);
    window.requestAnimationFrame(loop);

    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }

    resetBar();
  }

  async function loop() {
    if (!isLooping) return;
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
  }

  async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let probabilities = prediction.map(p => p.probability.toFixed(2));
    const max = indexOfMax(probabilities);
    document.getElementById("text").innerHTML = feedback[max];
  }

  async function captureImage() {
    isLooping = false;
    webcam.update();
    const prediction = await model.predict(webcam.canvas);
    let probabilities = prediction.map(p => p.probability.toFixed(2));
    const max = indexOfMax(probabilities);
    document.getElementById("text").innerHTML = feedback[max];
    document.getElementById("didyk").style.display = "flex";
  }

  function addRecycle() {
    document.getElementById("text").innerHTML = "Great! You recycled this item!";
    document.getElementById("didyk").style.display = "none";
    monthlyRecycle += 1;
    localStorage.setItem("monthlyRecycle", monthlyRecycle);
    isLooping = true;
    resetBar();
    loop();
  }

  function noRecycle() {
    document.getElementById("text").innerHTML = "No problem! You can always recycle it next time.";
    document.getElementById("didyk").style.display = "none";
    isLooping = true;
    loop();
    resetBar();
  }

  function setGoal() {
    const input = parseInt(document.getElementById("goalInput").value);
    if (!isNaN(input)) {
      monthlyGoal = input;
      localStorage.setItem("goal", monthlyGoal);
      document.getElementById("goalInput").value = "";
      resetBar();
    }
  }

  function addOutside() {
    monthlyRecycle += 1;
    localStorage.setItem("monthlyRecycle", monthlyRecycle);
    isLooping = true;
    resetBar();
    loop();
  }

  function resetBar() {
    const progressPercent = monthlyGoal > 0 ? (monthlyRecycle / monthlyGoal) * 100 : 0;
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    progressBar.style.width = progressPercent + "%";
    progressBar.textContent = Math.round(progressPercent) + "%";
    progressText.textContent = `You have recycled ${monthlyRecycle} out of ${monthlyGoal} items.`;
  }
  function checkAndResetMonthlyGoal() {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0 = Jan, 11 = Dec

  const storedMonth = localStorage.getItem("recycleMonth");

  if (storedMonth === null || parseInt(storedMonth) !== currentMonth) {
    // Reset values
    localStorage.setItem("monthlyRecycle", JSON.stringify(0));
    localStorage.setItem("recycleMonth", currentMonth.toString());

    // Reset UI vars if needed
    goal = 0;
    resetBar();
    document.getElementById("auxilary-tet").innerHTML = "New month! Your recycling goal has been reset.";
  }
}
window.onload = function () {
  checkAndResetMonthlyGoal();
  resetBar(); // Or any other function you'd like to run
  if (monthlyRecycle >= monthlyGoal) {
    document.getElementById("auxilary-text").innerHTML = "Congrats! You met your monthly goal.";
  } else {
    document.getElementById("auxilary-text").innerHTML = "Keep going! You can still meet your monthly goal.";
  }
};



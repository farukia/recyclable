      let retMonthlyRecycle = localStorage.getItem("monthlyRecycle")
      let retMonthlyGoal = localStorage.getItem("goal")

      if (retMonthlyGoal != null) {
        var monthlyGoal = JSON.parse(retMonthlyGoal)
      }

      if (retMonthlyRecycle != null) {
        var monthlyRecycle = JSON.parse(retMonthlyRecycle)
      }

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

        // Clear previous webcam and prediction
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

        const flip = false;
        webcam = new tmImage.Webcam(200, 200, flip);
        await webcam.setup({ facingMode: "environment" });
        await webcam.play();

        document.getElementById("webcam-container").appendChild(webcam.canvas);
        window.requestAnimationFrame(loop);

        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = "";
        for (let i = 0; i < maxPredictions; i++) {
          labelContainer.appendChild(document.createElement("div"));
        }
      }

      async function loop() {
        if (!isLooping) return;
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
      }

      async function predict() {
        const prediction = await model.predict(webcam.canvas);

        let probabilities = [];
        for (let i = 0; i < 7; i++) {
          probabilities.push(prediction[i].probability.toFixed(2));
        }

        const max = indexOfMax(probabilities);
        document.getElementById("text").innerHTML = feedback[max];
      }

      async function captureImage() {
        isLooping = false;
        webcam.update();
        const prediction = await model.predict(webcam.canvas);

        let probabilities = [];
        for (let i = 0; i < 7; i++) {
          probabilities.push(prediction[i].probability.toFixed(2));
        }

        const max = indexOfMax(probabilities);
        document.getElementById("text").innerHTML = feedback[max];
        document.getElementById("didyk").style.display = "flex";
      }
      function addRecycle() {
        document.getElementById("text").innerHTML = "Great! You recycled this item!";
        document.getElementById("didyk").style.display = "none";
        monthlyRecycle += 1;
        localStorage.setItem("monthlyRecycle", JSON.stringify(monthlyRecycle));
        isLooping = true;
        loop();
      }
      function noRecycle() {
        document.getElementById("text").innerHTML = "No problem! You can always recycle it next time.";
        document.getElementById("didyk").style.display = "none";
        isLooping = true;
        loop();
      }

      function setGoal() {
        monthlyGoal = document.getElementById("goalInput").value;
        localStorage.setItem("goal", JSON.stringify(monthlyGoal));
        document.getElementById("goalInput").value = "";
      }

    const progressPercent = (monthlyRecycle / monthlyGoal) * 100;

    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    progressBar.style.width = progressPercent + "%";
    progressBar.textContent = Math.round(progressPercent) + "%";

    progressText.textContent = `You have recycled ${currentProgress} out of ${recyclingGoal} items.`;
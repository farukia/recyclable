# The Recycle Disciple
## Winner of the 2024 Congressional App Challenge for OH-14!

**The Recycle Disciple** is a mobile/web application that uses image recognition to identify plastic Resin Identification Codes (RICs) and help users recycle more accurately. It tracks recycling goals and the number of items recycled—encouraging sustainable habits through education and engagement.

## 🌍 Mission

The Recycle Disciple empowers individuals to reduce plastic waste by simplifying the recycling process. By helping users recognize plastic types and track their environmental impact, the app contributes to the United Nations Sustainable Development Goals (SDGs), specifically:

- **SDG 12: Responsible Consumption and Production**

## ✨ Features

- 📸 **Camera-based plastic identification**  
  Scan plastic items to identify their RIC and get recycling guidance.

- 📊 **Track recycling goals**  
  Set recycling targets and view how many items you've kept out of landfills.

- 🔒 **Privacy-first**  
  No personal data is collected. Images are used only for live identification and are never stored or shared.

## 🔓 Open Source

This project is released under the [CC BY-NC 4.0](LICENSE). Contributions are welcome!

## 💾 Data Privacy

- Images taken for RIC detection are **not stored or uploaded**.
- No user-identifying data is collected.
- All recycling activity is stored **locally on the user’s device**.

View the full [Privacy Policy](https://farukia.github.io/privacy.html).

## 💡 Tech Stack

- Frontend: HTML5, JavaScript, MIT App Inventor
- Image Recognition: TensorFlow.js
- Local Storage: Browser/Device memory (no cloud or external server required)

## 🧠 How It Works

1. User scans a plastic item using the camera.
2. The app identifies the resin code (e.g., 1–7) using image recognition.
3. It provides recycling info based on the code.
4. Each successful identification is counted toward the user’s recycling goals.

## 📦 Use
Use on the web @ https://farukia.github.io/recyclable or download on Android (coming to Google Play soon!)

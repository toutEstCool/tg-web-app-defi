import React, { useEffect, useState } from "react";

const tg = window.Telegram.WebApp;

const App = () => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    tg.ready();
  }, []);

  const handleCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = canvas.toDataURL("image/png");
        setImageSrc(imgData);
        stream.getTracks().forEach((track) => track.stop());
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handlePhotoAccess = async () => {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.addEventListener("change", async () => {
        const file = fileInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setImageSrc(reader.result);
          };
          reader.readAsDataURL(file);
        }
      });
      fileInput.click();
    } catch (error) {
      console.error("Error accessing photos:", error);
    }
  };

  return (
    <div>
      <h1>Тестирование камеры и фотографий в Telegram Web App</h1>
      <button onClick={handleCameraAccess}>Открыть камеру</button>
      <button onClick={handlePhotoAccess}>Выбрать фотографию</button>
      {imageSrc && <img src={imageSrc} alt="Фотография" />}
    </div>
  );
};

export default App;

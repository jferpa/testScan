const video = document.getElementById('video');

// Solicitar acceso a la cámara
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  .then((stream) => {
    video.srcObject = stream;
    const track = stream.getTracks()[0];
    const imageCapture = new ImageCapture(track);

    // Función para capturar fotogramas y detectar códigos de barras
    const detectBarcode = () => {
      imageCapture.grabFrame()
        .then((imageBitmap) => {
          // Aquí puedes integrar una librería para detectar códigos de barras
          // Si se detecta un código de barras, reproducir un sonido
          const audio = new Audio('beep.mp3');
          audio.play();
        })
        .catch((error) => {
          console.error('Error al capturar fotograma:', error);
        });
    };

    // Detectar códigos de barras cada 100ms
    setInterval(detectBarcode, 100);
  })
  .catch((error) => {
    console.error('No se pudo acceder a la cámara:', error);
  });

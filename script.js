document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const resultado = document.getElementById('resultado');
  
    const codeReader = new ZXing.BrowserQRCodeReader();
  
    codeReader
      .decodeFromVideoDevice(null, 'video', (result, err) => {
        if (result) {
          resultado.textContent = `Código detectado: ${result.getText()}`;
          // Reproducir sonido al detectar un código
          const audio = new Audio('scanweb/sonido.mp3');
          audio.play();
        }
        if (err) {
          console.error('Error de decodificación:', err);
          resultado.textContent = `Error: ${err}`;
        }
      })
      .catch((err) => {
        console.error('Error al iniciar el lector:', err);
        resultado.textContent = `Error: ${err}`;
      });
  });
  
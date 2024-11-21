const video = document.getElementById('video');
const resultado = document.getElementById('resultado');

const codeReader = new ZXing.BrowserBarcodeReader();

codeReader
  .decodeFromVideoDevice(null, 'video', (result, err) => {
    if (result) {
      resultado.textContent = `Código detectado: ${result.getText()}`;
      // Reproducir sonido al detectar un código
      const audio = new Audio('sonido.mp3');
      audio.play();
    }
    if (err) {
      resultado.textContent = `Error: ${err}`;
    }
  })
  .catch((err) => {
    resultado.textContent = `Error: ${err}`;
  });

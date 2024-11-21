document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const resultado = document.getElementById('resultado');
    const cambiarCamaraBtn = document.getElementById('cambiarCamara');
  
    let currentStream = null;
    let currentDeviceId = null;
    let devices = [];
  
    const codeReader = new ZXing.BrowserQRCodeReader();
  
    // Función para obtener la lista de dispositivos de video disponibles
    async function obtenerDispositivos() {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        devices = mediaDevices.filter(device => device.kind === 'videoinput');
        if (devices.length > 0) {
          currentDeviceId = devices[0].deviceId;
          iniciarCamara(currentDeviceId);
        } else {
          resultado.textContent = 'No se encontraron cámaras disponibles.';
        }
      } catch (err) {
        console.error('Error al obtener dispositivos:', err);
        resultado.textContent = 'Error al obtener dispositivos.';
      }
    }
  
    // Función para iniciar la cámara con un dispositivo específico
    function iniciarCamara(deviceId) {
      if (currentStream) {
        detenerCamara();
      }
      const constraints = {
        video: { deviceId: { exact: deviceId } }
      };
      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          currentStream = stream;
          video.srcObject = stream;
          codeReader.decodeFromVideoDevice(deviceId, 'video', (result, err) => {
            if (result) {
              resultado.textContent = `Código detectado: ${result.getText()}`;
              const audio = new Audio('scanweb/sonido.mp3');
              audio.play();
            }
            if (err) {
              console.error('Error de decodificación:', err);
              resultado.textContent = `Error: ${err}`;
            }
          });
        })
        .catch((err) => {
          console.error('Error al acceder a la cámara:', err);
          resultado.textContent = 'Error al acceder a la cámara.';
        });
    }
  
    // Función para detener la cámara actual
    function detenerCamara() {
      if (currentStream) {
        const tracks = currentStream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
      }
    }
  
    // Función para cambiar entre cámaras
    function cambiarCamara() {
      if (devices.length > 1) {
        const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);
        const nextIndex = (currentIndex + 1) % devices.length;
        currentDeviceId = devices[nextIndex].deviceId;
        iniciarCamara(currentDeviceId);
      } else {
        resultado.textContent = 'No hay múltiples cámaras disponibles para cambiar.';
      }
    }
  
    // Inicializar la aplicación
    obtenerDispositivos();
  
    // Evento para cambiar de cámara
    cambiarCamaraBtn.addEventListener('click', cambiarCamara);
  });
  
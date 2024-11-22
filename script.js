document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const resultado = document.getElementById('resultado');
    const cambiarCamaraBtn = document.getElementById('cambiarCamara');
    const iniciarCamaraBtn = document.getElementById('iniciarCamara'); // Botón para iniciar la cámara

    let currentStream = null;
    let currentDeviceId = null;
    let devices = [];

    const codeReader = new ZXing.BrowserQRCodeReader();

    // Función para obtener la lista de dispositivos de video disponibles
    async function obtenerDispositivos() {
        try {
            // Enumerar todos los dispositivos multimedia disponibles
            const mediaDevices = await navigator.mediaDevices.enumerateDevices();
            devices = mediaDevices.filter(device => device.kind === 'videoinput');
            console.log(devices); // Ver los dispositivos detectados

            // Si encontramos dispositivos de entrada de video, iniciar la cámara
            if (devices.length > 0) {
                currentDeviceId = devices[0].deviceId; // Establecer el primer dispositivo como cámara predeterminada
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
            detenerCamara(); // Detener la cámara si ya hay una en uso
        }

        const constraints = {
            video: { deviceId: { exact: deviceId } } // Usamos el ID del dispositivo para obtener la cámara específica
        };

        // Solicitar permiso para acceder a la cámara
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                console.log('Cámara activada'); // Asegúrate de que la cámara está activada
                currentStream = stream;
                video.srcObject = stream;
                video.play(); // Reproducir el video de la cámara

                // Iniciar la decodificación de código de barras
                codeReader.decodeFromVideoDevice(deviceId, 'video', (result, err) => {
                    if (result) {
                        resultado.textContent = `Código detectado: ${result.getText()}`;
                        const audio = new Audio('sonido.mp3');
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
                resultado.textContent = 'Error al acceder a la cámara. Asegúrate de que los permisos estén habilitados.';
            });
    }

    // Función para detener la cámara actual
    function detenerCamara() {
        if (currentStream) {
            const tracks = currentStream.getTracks();
            tracks.forEach(track => track.stop()); // Detener todas las pistas de video
            video.srcObject = null;
        }
    }

    // Función para cambiar entre cámaras
    function cambiarCamara() {
        if (devices.length > 1) {
            const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);
            const nextIndex = (currentIndex + 1) % devices.length; // Cambiar al siguiente dispositivo en la lista
            currentDeviceId = devices[nextIndex].deviceId;
            iniciarCamara(currentDeviceId);
        } else {
            resultado.textContent = 'No hay múltiples cámaras disponibles para cambiar.';
        }
    }

    // Iniciar la cámara al hacer clic en el botón
    iniciarCamaraBtn.addEventListener('click', () => {
        obtenerDispositivos(); // Solo se llama al obtener dispositivos cuando se hace clic en "Iniciar Cámara"
    });

    // Evento para cambiar de cámara
    cambiarCamaraBtn.addEventListener('click', cambiarCamara);
});

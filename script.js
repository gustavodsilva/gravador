let mediaRecorder;
let chunks = [];

const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');

startButton.addEventListener('click', startRecording);
pauseButton.addEventListener('click', pauseRecording);
stopButton.addEventListener('click', stopRecording);

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = function(e) {
                chunks.push(e.data);
            }

            mediaRecorder.onstop = function() {
                const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
                const audioURL = URL.createObjectURL(blob);
                const audio = new Audio(audioURL);
                const downloadLink = document.createElement('a');
                downloadLink.href = audioURL;
                downloadLink.download = 'audio_recording.ogg';
                downloadLink.innerHTML = 'Download';
                document.body.appendChild(downloadLink);
            }

            mediaRecorder.start();
            startButton.disabled = true;
            pauseButton.disabled = false;
            stopButton.disabled = false;
        })
        .catch(err => {
            console.error('Erro ao acessar o microfone: ', err);
        });
}

function pauseRecording() {
    if (mediaRecorder.state === 'recording') {
        mediaRecorder.pause();
        pauseButton.textContent = 'Resume';
    } else if (mediaRecorder.state === 'paused') {
        mediaRecorder.resume();
        pauseButton.textContent = 'Pause';
    }
}

function stopRecording() {
    mediaRecorder.stop();
    startButton.disabled = false;
    pauseButton.disabled = true;
    stopButton.disabled = true;
}

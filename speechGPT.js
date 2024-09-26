(function() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    const promptTextarea = document.querySelector('#prompt-textarea');

    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = false;
    let isRecording = false;
    let recordedText = '';

    recognition.onresult = function (event) {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log('Fala detectada:', transcript);

      if (transcript === "ativar") {
        isRecording = true;
        promptTextarea.textContent = 'Fale algo..';
        console.log('Gravação iniciada. Fale a pergunta...');
      } else if (transcript === "enviar") {
        const sendButton = document.querySelector('button[aria-label="Enviar prompt"], button[data-testid="send-button"]');
        recordedText = '';
        if (sendButton) {
          sendButton.click();
          console.log('Botão de envio clicado.');
        } else {
          console.error('Botão de envio não encontrado.');
        }
      } else if (transcript === "apagar") {
        const promptTextarea = document.querySelector('#prompt-textarea');
        if (promptTextarea && promptTextarea.getAttribute('contenteditable') === 'true') {
          promptTextarea.textContent = ''; // Limpa o conteúdo
          recordedText = '';
          console.log('Campo de texto apagado.');
        } else {
          console.error('Elemento #prompt-textarea não encontrado ou não é contenteditable.');
        }
      } else if (isRecording) {
        recordedText += transcript + ' ';
        promptTextarea.textContent = recordedText;
      }
    };

    recognition.onend = function () {
      console.log("Reconhecimento de fala interrompido, reiniciando...");
      setTimeout(() => {
        recognition.start(); // Reinicia o reconhecimento quando ele é interrompido
      }, 1000); // Pequeno atraso para garantir que não há loops infinitos rápidos
    };

    function startListening() {
      recognition.start();
      console.log("Reconhecimento de fala iniciado. Fale algo...");
    }

    recognition.onerror = function (event) {
      console.error("Erro no reconhecimento de fala: ", event.error);
      setTimeout(() => {
        recognition.start(); // Reinicia o reconhecimento se houver um erro
      }, 1000);
    };

    // Botão para iniciar o reconhecimento de fala diretamente no console
    const btnStartListening = document.createElement('button');
    btnStartListening.textContent = 'Iniciar Reconhecimento de Fala';
    btnStartListening.onclick = startListening;
    document.body.appendChild(btnStartListening);

    startListening();
  } else {
    console.error('Este navegador não suporta reconhecimento de fala.');
  }
})();

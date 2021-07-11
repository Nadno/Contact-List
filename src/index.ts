'use strict';

import App from './App';
import WarnModal from './views/Feedback/Modal/Warn';
import Fallback from './views/Fallback';

import './styles/main.scss';

window.addEventListener('offline', alertConnectionLost);
window.addEventListener('online', alertReconnection);

function alertConnectionLost() {
  WarnModal.warn({
    message:
      'Para acessar outras partes da aplicação é necessário a conexão com a internet, por favor espere sua conexão até acessar outras partes da aplicação!',
    title: 'Conexão perdida',
  });

  Fallback.setFallbackView('ConnectionLost');
}

function alertReconnection() {
  alert('Conexão restabelecida!');
  Fallback.setFallbackView('NotFound');
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    const app = App.createApp(document.getElementById('app'));
    app.start();
  } catch (err) {
    console.error(err);
  }
});

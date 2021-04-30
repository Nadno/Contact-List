'use strict';

import App from './App';
import '../public/styles/main.scss';

document.addEventListener('DOMContentLoaded', () => {
  try {
    const app = App.createApp();
    app.start();
  } catch (err) {
    console.log(err);
  }
});

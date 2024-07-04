import { resetGame } from '../services/keyboard.service.js';
import { start } from '../../index.js';

export function goToHome() {
    document.querySelector('.game-over-modal').style.display = 'none';
    document.querySelector('.score-container').style.display = 'none';
    document.getElementById('home').style.display = 'block';
}

export function registerEventListeners() {
    document.querySelector('.button.start-now').addEventListener('click', start);
    document.querySelector('button.play-again').addEventListener('click', resetGame);
    document.querySelector('button.cancel').addEventListener('click', goToHome);
}
import { resetGame } from '../services/keyboard.service.js';
import { start } from '../../index.js';

export function goToHome() {
    navigate({ gameOverModal: 'none', score: 'none', home: 'block' });
}

export function registerEventListeners() {
    document.querySelector('.button.start-now').addEventListener('click', start);
    document.querySelector('button.play-again').addEventListener('click', resetGame);
    document.querySelector('button.cancel').addEventListener('click', goToHome);
}

export function navigate({ gameOverModal, score, home }) {
    document.querySelector('.game-over-modal').style.display = gameOverModal;
    document.querySelector('.score-container').style.display = score;
    document.getElementById('home').style.display = home;
}
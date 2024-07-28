import { resetGame } from '../services/keyboard.service.js';
import { start } from '../../index.js';
import { ElementsService } from '../services/elements.service.js';
import { showAchievementsPage } from '../services/achievements.service.js';

export function goToHome() {
    navigate({ gameOverModal: 'none', score: 'none', home: 'block', achievementsPage: 'none' });
}

export function registerEventListeners() {
    ElementsService.getInstance().getElement('.button.start-now').addEventListener('click', start);
    ElementsService.getInstance().getElement('button.play-again').addEventListener('click', resetGame);
    ElementsService.getInstance().getElement('button.cancel').addEventListener('click', goToHome);
    ElementsService.getInstance().getElement('.back-btn').addEventListener('click', goToHome);
    ElementsService.getInstance().getElement('.button.achievements-btn').addEventListener('click', showAchievementsPage);
}

export function navigate({ gameOverModal, score, home, achievementsPage }) {
    ElementsService.getInstance().getElement('.game-over-modal').style.display = gameOverModal;
    ElementsService.getInstance().getElement('.score-container').style.display = score;
    ElementsService.getInstance().getElement('#home').style.display = home;
    ElementsService.getInstance().getElement('#achievements-page').style.display = achievementsPage;
}
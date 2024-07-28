import { GameManager } from './game-manager.service.js';
import { ACHIEVEMENTS, ACHIEVEMENTS_STORAGE_KEY, GAME } from '../constants/constants.js';
import { ElementsService } from './elements.service.js';
import { navigate } from '../utilities/cosmetics.util.js';

export function incrementGameAchievement(achievementName, incrementAmount = 1) {
    const game = GameManager.getInstance();
    game.achievements[achievementName] += incrementAmount;
}

export function getLevelReachedOfAchievement(achievementType, achievementName) {
    const savedAchievements = getAchievementsFromLocalStorage();
    const reachedAmount = savedAchievements[achievementName];
    const levels = ACHIEVEMENTS[achievementType][achievementName];
    let levelReached = 0;
    levels.reverse().find((level, index) => {
        if (reachedAmount >= level) {
            levelReached = levels.length - index;
            return levelReached;
        }
    });
    return levelReached;
}

export function getAchievementsLevels() {
    const achievementsLevels = { game: {}, overall: {} };
    Object.keys(ACHIEVEMENTS).forEach((achievementType) => {
        Object.keys(ACHIEVEMENTS[achievementType]).forEach((achievementName) => {
            achievementsLevels[achievementType][achievementName] = getLevelReachedOfAchievement(achievementType, achievementName);
        });
    });
    return achievementsLevels;
}

export function updateAchievementsReached(newAchievements) {
    const achievements = getAchievementsFromLocalStorage();
    const updatedAchievements = {};
    Object.entries(achievements).forEach(([achievementName, amountReached]) => {
        if (newAchievements[achievementName] > amountReached) {
            updatedAchievements[achievementName] = newAchievements[achievementName];
        } else {
            updatedAchievements[achievementName] = amountReached;
        }
    });
    setAchievementsInLocalStorage(updatedAchievements);
}

export function getAchievementsFromLocalStorage() {
    const rawAchievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (!rawAchievements) {
        const achievements = GAME.INITIAL_ACHIEVEMENTS;
        setAchievementsInLocalStorage(achievements);
        return achievements;
    }
    return JSON.parse(rawAchievements);
}

export function setAchievementsInLocalStorage(achievements) {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
}

export function showAchievementUnlocked() {

}

export function showAchievementsPage() {
    navigate({ gameOverModal: 'none', score: 'none', home: 'none', achievementsPage: 'block' });

    const achievementsLevels = getAchievementsLevels();

    Object.keys(achievementsLevels).forEach((achievementType, categoriesIndex) => {
        Object.keys(achievementsLevels[achievementType]).forEach((achievementName, index) => {
            const numberOfAchievements = Object.keys(achievementsLevels[achievementType]).length;
            const achievementContainerEl = document.querySelectorAll('.achievement-container')[numberOfAchievements * categoriesIndex + index];
            const achievementLevel = achievementsLevels[achievementType][achievementName];
            for (let i = 0; i < achievementLevel; i++) {
                const starEl = achievementContainerEl.querySelector(`.achievement-status-star-${i + 1}`);
                starEl.style.backgroundColor = 'yellow';
            }
        });
    });
}
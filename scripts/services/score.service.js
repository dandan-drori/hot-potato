const highscoreKey = 'highscore';

export function saveScore(score) {
	const highscore = getHighscore();
	if (score <= highscore) return;
	localStorage.setItem(highscoreKey, score);
}

export function getHighscore() {
	return localStorage.getItem(highscoreKey) || 0;
}

import {
    init as initUI, showDefaultUI, showMenu, showGameUI, showLoading, hideLoading, showError, updateQuestion as updateQuestionToUI, showResultUI, showJudgement,
    optButtons, downloadButton, startNewGameBtn, resumeGameBtn, backToMenuBtn, retryBtn, errorBackBtn
} from "./game_ui.js"
import { isAuthenticated } from "./auth.js";
import { getGameIDForUser, createGame, deleteGame, generateNewQuestion, submitAnswer as submitAnswerApi, getJudgement } from "./game_api.js";

let currentQuestionId = null;
let gameId = null;
let text = null;
let options = null;
let hasExistingGame = false;
let lastAction = null; // Track last action for retry
let lastActionData = null; // Store data for retry

async function init() {
    await initUI();
    setupEventListeners();

    if (isAuthenticated()) {
        await showGameMenu();
    } else {
        showDefaultUI();
    }
}

function setupEventListeners() {
    optButtons.forEach((button, index) => {
        button.addEventListener('click', async () => {
            const questionId = currentQuestionId;
            const answer = index;
            await submitAnswer(questionId, answer);
        });
    });
    downloadButton.addEventListener('click', updateJudgement);
    startNewGameBtn.addEventListener('click', () => deleteAndStartNewGame());
    resumeGameBtn.addEventListener('click', () => resumeGame());
    backToMenuBtn.addEventListener('click', () => deleteAndBackToMenu());
    retryBtn.addEventListener('click', () => retryLastAction());
    errorBackBtn.addEventListener('click', () => deleteAndBackToMenu());
}

async function showGameMenu() {
    try {
        const response = await getGameIDForUser();
        hasExistingGame = response.data ? true : false;
        showMenu(hasExistingGame);
    } catch (error) {
        console.error('Error checking for existing game:', error);
        showMenu(false);
    }
}

async function startNewGame() {
    try {
        const response = await createGame();
        gameId = response['data']['gameid'];
        await loadNextQuestion();
        showGameUI();
    } catch (error) {
        console.error('Error starting new game:', error);
        showDefaultUI();
    }
}

async function deleteAndStartNewGame() {
    try {
        let response = await getGameIDForUser();
        if (response['success'] && response['data'] != null) {
            gameId = response['data']['gameId'];
            await deleteGame(gameId);
            console.log('Existing game deleted');
        }
        // Now start a new game
        await startNewGame();
    } catch (error) {
        console.error('Error deleting game and starting new:', error);
        // Still try to start a new game even if deletion fails
        await startNewGame();
    }
}

async function resumeGame() {
    try {
        let response = await getGameIDForUser();
        gameId = response['data']['gameId'];
        await loadNextQuestion();
        showGameUI();
    } catch (error) {
        console.error('Error resuming game:', error);
        showDefaultUI();
    }
}

async function deleteAndBackToMenu() {
    try {
        // Delete current game if one is active
        if (gameId) {
            await deleteGame(gameId);
            console.log('Current game deleted');
            gameId = null;
        }
        // Go back to menu
        await showGameMenu();
    } catch (error) {
        console.error('Error deleting game and returning to menu:', error);
        // Still go back to menu even if deletion fails
        await showGameMenu();
    }
}

async function launchGame() {
    try {
        let response = await getGameIDForUser();
        if (!response.data) {
            response = await createGame(); 
        }
        gameId = response['data']['gameId'];
        let questionData = await generateNewQuestion(gameId);
        updateQuestion(questionData['data']);
    } catch (error) {
        console.error('Error launching game:', error);
        showDefaultUI();
    }
}

async function loadNextQuestion() {
    try {
        lastAction = 'loadNextQuestion';
        lastActionData = {};
        showLoading();
        let questionData = await generateNewQuestion(gameId);
        hideLoading();
        updateQuestion(questionData['data']);
    } catch (error) {
        console.error('Error loading question:', error);
        showError('Failed to load the next question. Please try again.');
    }
}

async function submitAnswer(questionId, answerIndex) {
    try {
        lastAction = 'submitAnswer';
        lastActionData = { questionId, answerIndex };
        showLoading();
        await submitAnswerApi(questionId, options[answerIndex]);
        let response = await generateNewQuestion(gameId);
        hideLoading();
        updateQuestion(response['data']);
    } catch (error) {
        console.error('Error submitting answer:', error);
        showError('Failed to load the next question. Your answer has been recorded. Please try again.');
    }
}

function updateQuestion(questionData) {
    currentQuestionId = questionData['id'];
    text = questionData['text'];
    options = questionData['options'];
    if (questionData['cont']) {
        currentQuestionId = questionData['id'];
        updateQuestionToUI(text, options);
        showGameUI();
    } else {
        showResultUI();
    }
}

async function updateJudgement() {
    try {
        lastAction = 'updateJudgement';
        lastActionData = {};
        showLoading();
        const judgement = await callJudgement();
        hideLoading();
        showJudgement(judgement);
    } catch (error) {
        console.error('Error getting judgement:', error);
        showError('Failed to get judgement. Please try again.');
    }
}

async function callJudgement() {
    try {
        const response = await getJudgement(gameId);
        return response['data'];
    } catch (error) {
        console.error('Error getting judgement:', error);
        return null;
    }
}

async function retryLastAction() {
    if (lastAction === 'loadNextQuestion') {
        await loadNextQuestion();
    } else if (lastAction === 'submitAnswer') {
        const { questionId, answerIndex } = lastActionData;
        await submitAnswer(questionId, answerIndex);
    } else if (lastAction === 'updateJudgement') {
        await updateJudgement();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});
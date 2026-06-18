import {
    init as initUI, showDefaultUI, showMenu, showGameUI, showLoading, hideLoading, showError, updateQuestion, showResultUI, showJudgement,
    optButtons, downloadButton, startNewGameBtn, resumeGameBtn, backToMenuBtn, retryBtn, errorBackBtn
} from "./game_ui.js"
import { isAuthenticated } from "./auth.js";
import { getGameIDForUser, createGame, deleteGame, generateNewQuestion, submitAnswer, getJudgement } from "./game_api.js";

let currentQuestionId = null;
let gameId = null;
let text = null;
let options = null;
let hasExistingGame = false;
let lastAction = null; // Track last action for retry
let lastActionData = null; // Store data for retry

async function init() {
    await initUI();
    this.setupEventListeners();

    if (isAuthenticated()) {
        await this.showGameMenu();
    } else {
        showDefaultUI();
    }
},

function setupEventListeners() {
    optButtons.forEach((button, index) => {
        button.addEventListener('click', async () => {
            const questionId = this.currentQuestionId;
            const answer = index;
            await this.submitAnswer(questionId, answer);
        });
    });
    downloadButton.addEventListener('click', this.updateJudgement);
    startNewGameBtn.addEventListener('click', () => this.deleteAndStartNewGame());
    resumeGameBtn.addEventListener('click', () => this.resumeGame());
    backToMenuBtn.addEventListener('click', () => this.deleteAndBackToMenu());
    retryBtn.addEventListener('click', () => this.retryLastAction());
    errorBackBtn.addEventListener('click', () => this.deleteAndBackToMenu());
},

async function showGameMenu() {
    try {
        const response = await getGameIDForUser();
        this.hasExistingGame = response.data ? true : false;
        showMenu(this.hasExistingGame);
    } catch (error) {
        console.error('Error checking for existing game:', error);
        showMenu(false);
    }
},

async function startNewGame() {
    try {
        const response = await createGame();
        this.gameId = response['data']['gameid'];
        await this.loadNextQuestion();
        showGameUI();
    } catch (error) {
        console.error('Error starting new game:', error);
        showDefaultUI();
    }
},

async function deleteAndStartNewGame() {
    try {
        let response = await getGameIDForUser();
        if (response['success'] && response['data'] != null) {
            this.gameId = response['data']['gameId'];
            await deleteGame(this.gameId);
            console.log('Existing game deleted');
        }
        // Now start a new game
        await this.startNewGame();
    } catch (error) {
        console.error('Error deleting game and starting new:', error);
        // Still try to start a new game even if deletion fails
        await this.startNewGame();
    }
},

async function resumeGame() {
    try {
        let response = await getGameIDForUser();
        this.gameId = response['data']['gameId'];
        await this.loadNextQuestion();
        showGameUI();
    } catch (error) {
        console.error('Error resuming game:', error);
        showDefaultUI();
    }
},

async function deleteAndBackToMenu() {
    try {
        // Delete current game if one is active
        if (this.gameId) {
            await deleteGame(this.gameId);
            console.log('Current game deleted');
            this.gameId = null;
        }
        // Go back to menu
        await this.showGameMenu();
    } catch (error) {
        console.error('Error deleting game and returning to menu:', error);
        // Still go back to menu even if deletion fails
        await this.showGameMenu();
    }
},

async function launchGame() {
    try {
        let response = await getGameIDForUser();
        if (!response.data) {
            response = await createGame(); 
        }
        this.gameId = response['data']['gameId'];
        let questionData = await generateNewQuestion(this.gameId);
        this.updateQuestion(questionData['data']);
    } catch (error) {
        console.error('Error launching game:', error);
        showDefaultUI();
    }
},

async function loadNextQuestion() {
    try {
        this.lastAction = 'loadNextQuestion';
        this.lastActionData = {};
        showLoading();
        let questionData = await generateNewQuestion(this.gameId);
        hideLoading();
        this.updateQuestion(questionData['data']);
    } catch (error) {
        console.error('Error loading question:', error);
        showError('Failed to load the next question. Please try again.');
    }
},

async function submitAnswer(questionId, answerIndex) {
    try {
        this.lastAction = 'submitAnswer';
        this.lastActionData = { questionId, answerIndex };
        showLoading();
        await submitAnswer(questionId, this.options[answerIndex]);
        let response = await generateNewQuestion(this.gameId);
        hideLoading();
        this.updateQuestion(response['data']);
    } catch (error) {
        console.error('Error submitting answer:', error);
        showError('Failed to load the next question. Your answer has been recorded. Please try again.');
    }
},

function updateQuestion(questionData) {
    this.currentQuestionId = questionData['id'];
    this.text = questionData['text'];
    this.options = questionData['options'];
    if (questionData['cont']) {
        currentQuestionId = questionData['id'];
        updateQuestion(this.text, this.options);
        showGameUI();
    } else {
        showResultUI();
    }
},

async function updateJudgement() {
    try {
        this.lastAction = 'updateJudgement';
        this.lastActionData = {};
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
        const response = await getJudgement(this.gameId);
        return response['data'];
    } catch (error) {
        console.error('Error getting judgement:', error);
        return null;
    }
}

async function retryLastAction() {
    if (this.lastAction === 'loadNextQuestion') {
        await this.loadNextQuestion();
    } else if (this.lastAction === 'submitAnswer') {
        const { questionId, answerIndex } = this.lastActionData;
        await this.submitAnswer(questionId, answerIndex);
    } else if (this.lastAction === 'updateJudgement') {
        await this.updateJudgement();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});
let heroSection= null;
let protectedContent= null;
let gameMenu= null;
let gameSection= null;
let questionContainer= null;
let optionsContainers= null;
let optTags= null;
let downloadSection= null;
let judgementCard= null;
let judgementTitle= null;
let judgementJustification= null;
let backToMenuSection= null;
let loadingOverlay= null;
let errorOverlay= null;
let errorMessage= null;
export let optButtons= null;
export let downloadButton= null;
export let resumeGameBtn= null;
export let startNewGameBtn= null;
export let backToMenuBtn= null;
export let retryBtn= null;
export let errorBackBtn= null;

export async function init() {
    this.heroSection = document.querySelector('.hero');
    this.protectedContent = document.querySelector('#protected-content');
    this.gameMenu = document.querySelector('#game-menu');
    this.gameSection = document.querySelector('#game-section');
    this.downloadSection = document.querySelector('#download-section');
    this.judgementCard = document.querySelector('#judgement-card');
    this.questionContainer = document.querySelector('#question');
    this.optButtons = document.querySelectorAll('[id^=opt-btn]');
    this.optionsContainers = document.querySelectorAll('[id^=opt-text]');
    this.optTags = document.querySelectorAll('.tagline');
    this.judgementTitle = document.querySelector('#j-title');
    this.judgementJustification = document.querySelector('#j-just');
    this.confirmityCheckbox = document.querySelector('#confirmity-checkbox');
    this.downloadButton = document.querySelector('#download-btn');
    this.resumeGameBtn = document.querySelector('#resume-game-btn');
    this.startNewGameBtn = document.querySelector('#start-new-game-btn');
    this.backToMenuBtn = document.querySelector('#back-to-menu-btn');
    this.backToMenuSection = document.querySelector('#back-to-menu-section');
    this.loadingOverlay = document.querySelector('#loading-overlay');
    this.errorOverlay = document.querySelector('#error-overlay');
    this.retryBtn = document.querySelector('#retry-btn');
    this.errorBackBtn = document.querySelector('#error-back-btn');
    this.errorMessage = document.querySelector('#error-message');
}

export function showMenu(hasExistingGame = false) {
    this.heroSection.style.display = 'none';
    this.protectedContent.style.display = 'block';
    this.gameMenu.style.display = 'block';
    this.gameSection.style.display = 'none';
    this.downloadSection.style.display = 'none';
    this.backToMenuSection.style.display = 'none';
    this.resumeGameBtn.style.display = hasExistingGame ? 'block' : 'none';
}

export function showGameUI() {
    this.heroSection.style.display = 'none';
    this.protectedContent.style.display = 'block';
    this.gameMenu.style.display = 'none';
    this.gameSection.style.display = 'block';
    this.downloadSection.style.display = 'none';
    this.backToMenuSection.style.display = 'none';
    this.judgementCard.style.display = 'none';
}

export function showDefaultUI() {
    this.heroSection.style.display = 'block';
    this.protectedContent.style.display = 'none';
}

export function showResultUI() {
    this.gameMenu.style.display = 'none';
    this.gameSection.style.display = 'none';
    this.downloadSection.style.display = 'block';
    this.backToMenuSection.style.display = 'block';
    this.judgementCard.style.display = 'none';
}

export function showJudgement(judgement) {
    this.judgementCard.style.display = 'block';
    if (!this.confirmityCheckbox.checked) {
        this.judgementTitle.textContent = judgement['critical']['title'];
        this.judgementJustification.textContent = judgement['critical']['justification'];
    } else {
        this.judgementTitle.textContent = judgement['comformity']['title'];
        this.judgementJustification.textContent = judgement['comformity']['justification'];
    }
}

export function updateQuestion(question, options) {
    this.questionContainer.textContent = question;
    options.forEach((option, index) => {
        let oIndex = option.indexOf('(');
        let cIndex = option.indexOf(')');
        if (oIndex !== -1 && cIndex !== -1 && cIndex > oIndex) {
            this.optTags[index].textContent = option.substring(oIndex + 1, cIndex);
            const optContainer = this.optionsContainers[index];
            optContainer.textContent = option.substring(0, oIndex).trim();
        } else {
            this.optTags[index].textContent = 'Option ' + (index + 1);
            const optContainer = this.optionsContainers[index];
            optContainer.textContent = option;
        }
    });
}

export function showLoading() {
    this.loadingOverlay.style.display = 'flex';
    this.errorOverlay.style.display = 'none';
    // Disable all option buttons during loading
    this.optButtons.forEach(btn => btn.disabled = true);
}

export function hideLoading() {
    this.loadingOverlay.style.display = 'none';
    // Enable all option buttons after loading
    this.optButtons.forEach(btn => btn.disabled = false);
}

export function showError(message = 'Failed to load the next question. Please try again.') {
    this.loadingOverlay.style.display = 'none';
    this.errorOverlay.style.display = 'flex';
    this.errorMessage.textContent = message;
}

export function hideError() {
    this.errorOverlay.style.display = 'none';
}
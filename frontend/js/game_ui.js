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
let confirmityCheckbox= null;
export let optButtons= null;
export let downloadButton= null;
export let resumeGameBtn= null;
export let startNewGameBtn= null;
export let backToMenuBtn= null;
export let retryBtn= null;
export let errorBackBtn= null;

export async function init() {
    debugger;
    heroSection = document.querySelector('.hero');
    protectedContent = document.querySelector('#protected-content');
    gameMenu = document.querySelector('#game-menu');
    gameSection = document.querySelector('#game-section');
    downloadSection = document.querySelector('#download-section');
    judgementCard = document.querySelector('#judgement-card');
    questionContainer = document.querySelector('#question');
    optButtons = document.querySelectorAll('[id^=opt-btn]');
    optionsContainers = document.querySelectorAll('[id^=opt-text]');
    optTags = document.querySelectorAll('.tagline');
    judgementTitle = document.querySelector('#j-title');
    judgementJustification = document.querySelector('#j-just');
    confirmityCheckbox = document.querySelector('#confirmity-checkbox');
    downloadButton = document.querySelector('#download-btn');
    resumeGameBtn = document.querySelector('#resume-game-btn');
    startNewGameBtn = document.querySelector('#start-new-game-btn');
    backToMenuBtn = document.querySelector('#back-to-menu-btn');
    backToMenuSection = document.querySelector('#back-to-menu-section');
    loadingOverlay = document.querySelector('#loading-overlay');
    errorOverlay = document.querySelector('#error-overlay');
    retryBtn = document.querySelector('#retry-btn');
    errorBackBtn = document.querySelector('#error-back-btn');
    errorMessage = document.querySelector('#error-message');
}

export function showMenu(hasExistingGame = false) {
    heroSection.style.display = 'none';
    protectedContent.style.display = 'block';
    gameMenu.style.display = 'block';
    gameSection.style.display = 'none';
    downloadSection.style.display = 'none';
    backToMenuSection.style.display = 'none';
    resumeGameBtn.style.display = hasExistingGame ? 'block' : 'none';
}

export function showGameUI() {
    heroSection.style.display = 'none';
    protectedContent.style.display = 'block';
    gameMenu.style.display = 'none';
    gameSection.style.display = 'block';
    downloadSection.style.display = 'none';
    backToMenuSection.style.display = 'none';
    judgementCard.style.display = 'none';
}

export function showDefaultUI() {
    heroSection.style.display = 'block';
    protectedContent.style.display = 'none';
}

export function showResultUI() {
    gameMenu.style.display = 'none';
    gameSection.style.display = 'none';
    downloadSection.style.display = 'block';
    backToMenuSection.style.display = 'block';
    judgementCard.style.display = 'none';
}

export function showJudgement(judgement) {
    judgementCard.style.display = 'block';
    if (!confirmityCheckbox.checked) {
        judgementTitle.textContent = judgement['critical']['title'];
        judgementJustification.textContent = judgement['critical']['justification'];
    } else {
        judgementTitle.textContent = judgement['comformity']['title'];
        judgementJustification.textContent = judgement['comformity']['justification'];
    }
}

export function updateQuestion(question, options) {
    questionContainer.textContent = question;
    options.forEach((option, index) => {
        let oIndex = option.indexOf('(');
        let cIndex = option.indexOf(')');
        if (oIndex !== -1 && cIndex !== -1 && cIndex > oIndex) {
            optTags[index].textContent = option.substring(oIndex + 1, cIndex);
            const optContainer = optionsContainers[index];
            optContainer.textContent = option.substring(0, oIndex).trim();
        } else {
            optTags[index].textContent = 'Option ' + (index + 1);
            const optContainer = optionsContainers[index];
            optContainer.textContent = option;
        }
    });
}

export function showLoading() {
    loadingOverlay.style.display = 'flex';
    errorOverlay.style.display = 'none';
    // Disable all option buttons during loading
    optButtons.forEach(btn => btn.disabled = true);
}

export function hideLoading() {
    loadingOverlay.style.display = 'none';
    // Enable all option buttons after loading
    optButtons.forEach(btn => btn.disabled = false);
}

export function showError(message = 'Failed to load the next question. Please try again.') {
    loadingOverlay.style.display = 'none';
    errorOverlay.style.display = 'flex';
    errorMessage.textContent = message;
}

export function hideError() {
    errorOverlay.style.display = 'none';
}
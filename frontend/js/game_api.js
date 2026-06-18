import { call } from "./client.js"


export async function createGame() {
    return call('/api/game', { method: 'POST'});
}

export async function getGameIDForUser() {
    return call('/api/game');
}

export async function generateNewQuestion(gameId) {
    if (!gameId) {
        throw new Error('Game ID is required');
    }
    return call(`/api/game/questions/generate/${gameId}`, { method: 'POST' });
}

export async function getAllQuestions(gameId) {
    if (!gameId) {
        throw new Error('Game ID is required');
    }
    return call(`/api/game/questions/${gameId}`);
}

export async function submitAnswer(questionId, answer) {
    if (!questionId) {
        throw new Error('Question ID is required');
    }
    if (!answer) {
        throw new Error('Answer is required');
    }
    return call(`/api/game/answer/${questionId}?answer=${encodeURIComponent(answer)}`, {
        method: 'PATCH',
    });
}

export async function getJudgement(gameId) {
    if (!gameId) {
        throw new Error('Game ID is required');
    }
    return call(`/api/game/judgement/${gameId}`);
}

export async function deleteGame(gameId) {
    if (!gameId) {
        throw new Error('Game ID is required');
    }
    return call(`/api/game/${gameId}`, { method: 'DELETE' });
}
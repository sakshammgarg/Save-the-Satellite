// ==================== SCOREBOARD SYSTEM ====================

const STORAGE_KEY = 'satelliteGameHighScores';
const MAX_SCORES = 10;

let scores = [];

// ==================== INITIALIZE SCOREBOARD ====================
export function initScoreboard() {
    loadScores();
    console.log('✅ Scoreboard initialized. High scores:', scores);
}

// ==================== LOAD SCORES FROM LOCALSTORAGE ====================
function loadScores() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        scores = stored ? JSON.parse(stored) : [];
        scores.sort((a, b) => b.survival - a.survival);
    } catch (e) {
        console.warn('Error loading scores:', e);
        scores = [];
    }
}

// ==================== SAVE SCORES TO LOCALSTORAGE ====================
function saveScores() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch (e) {
        console.warn('Error saving scores:', e);
    }
}

// ==================== ADD NEW SCORE ====================
export function addScore(survivalTime, debrisHits = 0) {
    const score = {
        survival: survivalTime,
        debrisHits: debrisHits,
        timestamp: new Date().toISOString(),
        date: new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date())
    };

    scores.push(score);
    scores.sort((a, b) => b.survival - a.survival);
    
    // Keep only top scores
    if (scores.length > MAX_SCORES) {
        scores = scores.slice(0, MAX_SCORES);
    }

    saveScores();
    console.log(`📊 New score added: ${survivalTime}s (${debrisHits} debris hits)`);
    
    return {
        score: score,
        rank: scores.indexOf(score) + 1,
        isNewHighScore: scores.indexOf(score) === 0
    };
}

// ==================== GET ALL SCORES ====================
export function getAllScores() {
    return [...scores];
}

// ==================== GET TOP SCORE ====================
export function getTopScore() {
    return scores.length > 0 ? scores[0] : null;
}

// ==================== GET RANK ====================
export function getRank(survivalTime) {
    let rank = 1;
    for (let i = 0; i < scores.length; i++) {
        if (scores[i].survival > survivalTime) {
            rank++;
        } else {
            break;
        }
    }
    return rank;
}

// ==================== CLEAR ALL SCORES ====================
export function clearAllScores() {
    scores = [];
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ All scores cleared');
}

// ==================== FORMAT SCORE DISPLAY ====================
export function formatScoreDisplay(survivialTime, debrisHits) {
    return `${survivalTime}s | ${debrisHits} hits`;
}

// ==================== GET SCOREBOARD HTML ====================
export function getScoreboardHTML() {
    let html = '<div class="scoreboard-content">';
    html += '<h3>🏆 Top 10 High Scores</h3>';
    html += '<table class="scoreboard-table">';
    html += '<tr><th>Rank</th><th>Time</th><th>Debris Hits</th><th>Date</th></tr>';

    if (scores.length === 0) {
        html += '<tr><td colspan="4" style="text-align: center; color: #888;">No scores yet. Start playing!</td></tr>';
    } else {
        scores.forEach((score, idx) => {
            html += `<tr>
                <td>#${idx + 1}</td>
                <td><strong>${score.survival}s</strong></td>
                <td>${score.debrisHits}</td>
                <td style="font-size: 12px; color: #888;">${score.date}</td>
            </tr>`;
        });
    }

    html += '</table>';
    html += '</div>';
    return html;
}

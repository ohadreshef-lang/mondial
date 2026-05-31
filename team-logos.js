// Default to UCL 2025 — it starts before the World Cup
activeTournament = 'ucl2025';

// Default stage filter to Final (semi-finals have already ended)
stageFilter = 'Final';

// Reduce bet lock window to 5 minutes before kickoff (was 60 minutes).
function matchIsLocked(match) {
    return parseMatchDate(match.date) - new Date() <= 5 * 60 * 1000;
}

// Extend TEAM_LOGOS with Atletico Madrid and Bayern Munich SVG logos
Object.assign(TEAM_LOGOS, {
    'atletico madrid':      'assets/flags/atletico.svg',
    'atletico de madrid':   'assets/flags/atletico.svg',
    'atlético madrid':      'assets/flags/atletico.svg',
    'atlético de madrid':   'assets/flags/atletico.svg',
    'atletico':             'assets/flags/atletico.svg',
    'אתלטיקו מדריד':        'assets/flags/atletico.svg',
    'אתלטיקו':              'assets/flags/atletico.svg',
    'bayern munich':        'assets/flags/bayern.svg',
    'fc bayern munich':     'assets/flags/bayern.svg',
    'fc bayern':            'assets/flags/bayern.svg',
    'bayern':               'assets/flags/bayern.svg',
    'באיירן מינכן':         'assets/flags/bayern.svg',
    'באיירן':               'assets/flags/bayern.svg',
});

// Fix: re-acquire anonymous auth token for returning email-login users.
function initAuth() {
    if (!auth) { showLoginScreen(); return; }
    auth.onAuthStateChanged(async user => {
        if (user) {
            await setupUserFromAuth(user);
            if (isAdminMode) {
                show('admin-panel');
                hide('login-screen');
                hide('main-app');
            } else {
                await routeAfterLogin();
            }
        } else {
            const saved = localStorage.getItem('wc2026_emailUser');
            if (saved) {
                try {
                    currentUser = JSON.parse(saved);
                    try {
                        await auth.signInAnonymously();
                        return;
                    } catch(e) { console.warn('Anonymous re-auth failed:', e); }
                    if (isAdminMode) {
                        show('admin-panel');
                        hide('login-screen');
                        hide('main-app');
                    } else {
                        await routeAfterLogin();
                    }
                    return;
                } catch(e) {
                    localStorage.removeItem('wc2026_emailUser');
                }
            }
            currentUser = null;
            showLoginScreen();
        }
    });
}

// Fix: resolve cross-tournament user names in the leaderboard.
//
// Root cause: users who registered when activeTournament was 'worldcup2026'
// have their profile at worldcup2026/users/{uid}. When the app runs in
// ucl2025 mode it looks in ucl2025/users/{uid} (missing) and never adds the
// uid to groupUsersCache, so renderLeaderboard falls back to "משתמש".
//
// Fix: wrap renderLeaderboard so that before every render it fetches any
// missing names from the other tournament's users path, then writes them
// into the current path (one-time migration) so future renders are instant.
document.addEventListener('DOMContentLoaded', function () {
    var _orig = renderLeaderboard;
    renderLeaderboard = async function () {
        if (db && typeof groupMembers !== 'undefined') {
            var FALLBACK = activeTournament === 'ucl2025' ? 'worldcup2026' : 'ucl2025';
            var needed = Object.keys(groupMembers).filter(function (uid) {
                return !groupUsersCache[uid] || !groupUsersCache[uid].name;
            });
            if (needed.length) {
                await Promise.all(needed.map(function (uid) {
                    return db.ref(FALLBACK + '/users/' + uid).once('value').then(function (snap) {
                        var u = snap.val();
                        if (u && u.name) {
                            groupUsersCache[uid] = { name: u.name, email: u.email };
                            // Migrate to current path so the next page load is instant.
                            db.ref(activeTournament + '/users/' + uid)
                              .set({ name: u.name, email: u.email });
                        }
                    });
                }));
            }
        }
        _orig();
    };

    // Tournament switcher buttons
    var cfg = TOURNAMENTS[activeTournament];
    if (!cfg) return;
    document.querySelectorAll('.tournament-btn').forEach(function (b) {
        b.classList.toggle('active', b.dataset.tournament === activeTournament);
    });
    var titleEl = document.getElementById('app-bar-title');
    if (titleEl) titleEl.textContent = cfg.icon + ' ' + cfg.label;
    document.querySelectorAll('.filter-btn[data-stage]').forEach(function (b) {
        var s = b.dataset.stage;
        b.style.display = (s === 'all' || cfg.stages.includes(s)) ? '' : 'none';
        b.classList.toggle('active', s === stageFilter);
    });
});

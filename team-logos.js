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
// Replaces the version in app.js that routes without a valid Firebase token,
// causing PERMISSION_DENIED on group create/join when DB rules require auth.
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

// Fix: users who registered under worldcup2026 have their names stored at
// worldcup2026/users/{uid}. When the active tournament is ucl2025 the app
// looks in ucl2025/users/{uid} which is empty, showing "משתמש" as fallback.
// This function fills in missing names from the other tournament path and
// also writes them into the current path so future lookups succeed.
function patchMissingUserNames() {
    if (!db || typeof groupUsersCache === 'undefined') return;
    var FALLBACK = activeTournament === 'ucl2025' ? 'worldcup2026' : 'ucl2025';
    var missing = Object.keys(groupUsersCache).filter(function(uid) {
        return !groupUsersCache[uid] || !groupUsersCache[uid].name;
    });
    if (!missing.length) return;
    missing.forEach(function(uid) {
        db.ref(FALLBACK + '/users/' + uid).once('value').then(function(snap) {
            var u = snap.val();
            if (u && u.name) {
                groupUsersCache[uid] = { name: u.name, email: u.email };
                // Also write into current tournament path so direct lookups work.
                db.ref(activeTournament + '/users/' + uid).set({ name: u.name, email: u.email });
                // Re-render leaderboard if the tab is currently visible.
                if (typeof renderLeaderboard === 'function') renderLeaderboard();
            }
        });
    });
}

// Sync tournament UI after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    var cfg = TOURNAMENTS[activeTournament];
    if (!cfg) return;

    // Tournament switcher buttons
    document.querySelectorAll('.tournament-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.tournament === activeTournament);
    });

    // App bar title
    var titleEl = document.getElementById('app-bar-title');
    if (titleEl) titleEl.textContent = cfg.icon + ' ' + cfg.label;

    // Stage filter buttons: hide WC-only stages, mark Final as active
    document.querySelectorAll('.filter-btn[data-stage]').forEach(function(b) {
        var s = b.dataset.stage;
        var visible = s === 'all' || cfg.stages.includes(s);
        b.style.display = visible ? '' : 'none';
        b.classList.toggle('active', s === stageFilter);
    });

    // Patch missing user names: run after auth settles and group data loads.
    setTimeout(patchMissingUserNames, 2500);
    setTimeout(patchMissingUserNames, 6000);
});

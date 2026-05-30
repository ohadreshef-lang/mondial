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

// Fix: users who registered under worldcup2026 have their names at
// worldcup2026/users/{uid}. When the active tournament is ucl2025, the app
// looks in ucl2025/users/{uid} (empty) and falls back to "משתמש".
//
// Root cause: app.js only adds a uid to groupUsersCache when it finds data
// at the current-tournament users path. Users missing from that path are
// never added to the cache at all, so Object.keys(groupUsersCache) won't
// include them. We must query the group's member list directly instead.
async function patchMissingUserNames() {
    if (!db) return;
    var gid = typeof currentGroupId !== 'undefined' ? currentGroupId : null;
    if (!gid) return;
    var FALLBACK = activeTournament === 'ucl2025' ? 'worldcup2026' : 'ucl2025';

    // Fetch all member UIDs from the current group.
    var membersSnap = await db.ref(activeTournament + '/groups/' + gid + '/members').once('value');
    var members = membersSnap.val();
    if (!members) return;

    var patched = false;
    for (var uid of Object.keys(members)) {
        // Skip UIDs that already have a name in the cache.
        if (groupUsersCache[uid] && groupUsersCache[uid].name) continue;

        // Try the fallback tournament path.
        var snap = await db.ref(FALLBACK + '/users/' + uid).once('value');
        var u = snap.val();
        if (u && u.name) {
            groupUsersCache[uid] = { name: u.name, email: u.email };
            // Write into current path so future page loads don't need the fallback.
            db.ref(activeTournament + '/users/' + uid).set({ name: u.name, email: u.email });
            patched = true;
        }
    }

    if (patched && typeof renderLeaderboard === 'function') renderLeaderboard();
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

    // Patch missing user names after auth settles and group loads.
    // Two attempts: first catches the common case, second catches slow auth.
    setTimeout(patchMissingUserNames, 3000);
    setTimeout(patchMissingUserNames, 8000);

    // Also patch whenever the leaderboard tab is clicked.
    document.addEventListener('click', function(e) {
        if (e.target && e.target.dataset && e.target.dataset.tab === 'leaderboard') {
            setTimeout(patchMissingUserNames, 500);
        }
    });
});

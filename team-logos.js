// Switch back to World Cup 2026 — UCL 2025 is over
activeTournament = 'worldcup2026';

// All games lock 5 minutes before kickoff
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
            if (pendingJoinCode || isAdminMode) showLoginScreen();
            else showModeChoice();
        }
    });
}

// Fix: Google login merging + email uniqueness enforcement.
//
// Two scenarios:
// 1. Email-first then Google: user registered via email form → profile exists at
//    users/{emailToId(email)}. When they later sign in with Google (same email),
//    detect the existing profile and use it as canonical identity (merge).
// 2. Google-first then email form: detect via fetchSignInMethodsForEmail that
//    the email has a Google sign-in method and show a clear error message.
async function setupUserFromAuth(firebaseUser) {
    if (firebaseUser.isAnonymous) {
        const saved = localStorage.getItem('wc2026_emailUser');
        if (saved) {
            try { currentUser = JSON.parse(saved); return; } catch(e) {}
        }
        return;
    }
    const email       = firebaseUser.email || '';
    const firebaseUid = firebaseUser.uid;
    let   name        = firebaseUser.displayName || email.split('@')[0] || 'User';

    // Canonical identity: always email-derived for users with an email.
    // If only a firebaseUid record exists (old Google-login user, not yet merged),
    // keep using it until adminMergeDuplicates() migrates them.
    let userId = firebaseUid;
    if (db && email) {
        try {
            const emailUserId = emailToId(email);
            if (emailUserId !== firebaseUid) {
                const [emailSnap, uidSnap] = await Promise.all([
                    ref(`users/${emailUserId}`).once('value'),
                    ref(`users/${firebaseUid}`).once('value'),
                ]);
                if (emailSnap.exists()) {
                    // Email-based profile exists — use as canonical
                    userId = emailUserId;
                    name   = emailSnap.val().name || name;
                } else if (!uidSnap.exists()) {
                    // Brand-new user — start canonical from the beginning
                    userId = emailUserId;
                }
                // If only firebaseUid record exists, leave userId as firebaseUid
                // until the admin merge migrates data.
            }
        } catch(e) {}
    }

    if (db) {
        try {
            const snap = await ref(`users/${userId}`).once('value');
            if (!snap.exists()) {
                await ref(`users/${userId}`).set({ name, email });
            } else {
                name = snap.val().name || name;
            }
        } catch(err) { console.warn('User sync failed:', err); }
    }
    currentUser = { userId, name, email };
}

async function handleEmailLogin(e) {
    e.preventDefault();
    const errEl = $('login-error');
    hideEl(errEl);
    let   name  = $('input-name').value.trim();
    const email = $('input-email').value.trim().toLowerCase();
    if (!name || !email || !email.includes('@')) {
        errEl.textContent = 'נא למלא שם ואימייל תקין';
        showEl(errEl);
        return;
    }
    // Block email-form login when the address is registered with Google.
    if (auth) {
        try {
            const methods = await auth.fetchSignInMethodsForEmail(email);
            if (methods && methods.includes('google.com')) {
                errEl.textContent = 'האימייל הזה מחובר לחשבון Google — אנא השתמש בכפתור "כניסה עם Google"';
                showEl(errEl);
                return;
            }
        } catch(e) { /* network / config error — allow through */ }
    }
    const userId = emailToId(email);
    if (db) {
        try {
            const snap = await ref(`users/${userId}`).once('value');
            if (!snap.exists()) {
                await ref(`users/${userId}`).set({ name, email });
            } else {
                name = snap.val().name || name;
            }
        } catch(err) { console.warn('User sync failed:', err); }
    }
    currentUser = { userId, name, email, emailLogin: true };
    localStorage.setItem('wc2026_emailUser', JSON.stringify(currentUser));
    if (auth) {
        try {
            await auth.signInAnonymously();
            return;
        } catch(e) { console.warn('Anonymous auth failed:', e); }
    }
    await routeAfterLogin();
}

// Fix: cross-tournament user name resolution in leaderboard.
// Users who registered under ucl2025 may have their profile only there;
// this wrapper fetches missing names from the other path before rendering.
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
                            db.ref(activeTournament + '/users/' + uid)
                              .set({ name: u.name, email: u.email });
                        } else if (typeof currentUser !== 'undefined' && currentUser && uid === currentUser.userId && currentUser.name) {
                            groupUsersCache[uid] = { name: currentUser.name, email: currentUser.email || '' };
                            db.ref(activeTournament + '/users/' + uid)
                              .set({ name: currentUser.name, email: currentUser.email || '' });
                        } else if (typeof groupMembers !== 'undefined' && groupMembers[uid] && groupMembers[uid].name) {
                            groupUsersCache[uid] = { name: groupMembers[uid].name };
                            db.ref(activeTournament + '/users/' + uid)
                              .set({ name: groupMembers[uid].name });
                        }
                    });
                }));
            }
        }
        _orig();
    };

    // Sync tournament button + app bar title to active tournament.
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

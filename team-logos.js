// Switch back to World Cup 2026 — UCL 2025 is over
activeTournament = 'worldcup2026';

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

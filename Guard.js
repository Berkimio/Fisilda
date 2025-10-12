// Tüm yaygın kısayolları engelle
document.onkeydown = function (e) {
    // Büyük/küçük harf farkı olmadan kontrol
    const key = e.key.toLowerCase();

    if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && key === 'i') || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && key === 'j') || // Ctrl+Shift+J
        (e.ctrlKey && key === 'u') || // Ctrl+U
        (e.ctrlKey && key === 's') || // Ctrl+S
        (e.ctrlKey && key === 'c') || // Ctrl+C
        (e.ctrlKey && key === 'v') || // Ctrl+V
        (e.ctrlKey && key === 'x') || // Ctrl+X
        (e.ctrlKey && key === 'p') || // Ctrl+P
        (e.ctrlKey && key === 'i') || // Ctrl+i
        (e.ctrlKey && e.shiftKey && key === 'c') // Ctrl+Shift+C
    ) {
        e.preventDefault();
        return false;
    }
};

// Sağ tık menüsünü engelle
document.addEventListener('contextmenu', e => e.preventDefault());

// Konsol algılama yöntemi 1 (Object.defineProperty)
let devtoolsOpen = false;
const element = new Image();
Object.defineProperty(element, 'id', {
    get: function () {
        devtoolsOpen = true;
    }
});



// Konsol algılama yöntemi 3 (debugger tuzağı)
function detectDebuggerTrap() {
    let start = Date.now();
    debugger;
    return Date.now() - start > 50;
}

// Düzenli kontrol
setInterval(function () {
    devtoolsOpen = false;
    console.log('%c', element);
    if (devtoolsOpen || detectDevTools() || detectDebuggerTrap()) {
        document.body.innerHTML = '';
        alert("Kodları mı kurcalıyorsun? 🙃");
        window.location.href = "index.html";
    }
}, 500);

// Sayfa kaynağı görüntüleme girişimi engelleme
document.addEventListener('beforeprint', function (e) {
    alert("Yazdırma Kullanmak yasaktır!");
    e.preventDefault();
});
// hacker tuzağı
const _0x1a2b3c = (function() {
    const _0x4d5e6f = {
        'a': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        'b': function _0x2f8e1c(_0x3a9b4d) {
            let _0x5c6d7e = '';
            for (let _0x8e9f0a = 0; _0x8e9f0a < _0x3a9b4d.length; _0x8e9f0a++) {
                _0x5c6d7e += String.fromCharCode(_0x3a9b4d.charCodeAt(_0x8e9f0a) ^ 0x42);
            }
            return _0x5c6d7e;
        },
        'c': function _0x1d3f5e(_0x7a8b9c) {
            return btoa(_0x7a8b9c).split('').reverse().join('');
        },
        'd': function _0x4e5f6g(_0x9a8b7c) {
            return _0x4e5f6g['b'](_0x4e5f6g['c'](_0x9a8b7c));
        }
    };
    return _0x4d5e6f;
})();

// Firebase  dinamik trap
const _0x2f8e9a = (function() {
    const _0x3c4d5e = [
        'AIzaSyBG7k-zFAXQ37vhKtjGRJDT5ZiGBPQhqT4',
        'fisilda-4d414.firebaseapp.com',
        'fisilda-4d414',
        'fisilda-4d414.firebasestorage.app',
        '857850492179',
        '1:857850492179:web:0b57c6314ca58a4daed6e6'
    ];
    
    return {
        'apiKey': _0x3c4d5e[0],
        'authDomain': _0x3c4d5e[1],
        'projectId': _0x3c4d5e[2],
        'storageBucket': _0x3c4d5e[3],
        'messagingSenderId': _0x3c4d5e[4],
        'appId': _0x3c4d5e[5]
    };
})();


const _0x7d8e9f = (function() {
    let _0x9a8b7c = {};
    const _0x1c2d3e = ['app', 'auth', 'db', 'currentUser', 'activeChatUID'];
    
    _0x1c2d3e.forEach((_0x3e4f5a, _0x6g7h8i) => {
        _0x9a8b7c[_0x1a2b3c['b'](_0x3e4f5a)] = null;
    });
    
    return _0x9a8b7c;
})();


(function() {
    const _0x3a4b5c = initializeApp(_0x2f8e9a);
    const _0x6c7d8e = getAuth(_0x3a4b5c);
    const _0x9d0e1f = getFirestore(_0x3a4b5c);
    
    _0x7d8e9f[_0x1a2b3c['b']('app')] = _0x3a4b5c;
    _0x7d8e9f[_0x1a2b3c['b']('auth')] = _0x6c7d8e;
    _0x7d8e9f[_0x1a2b3c['b']('db')] = _0x9d0e1f;
})();


const _0x4e5f6g = new Proxy({}, {
    get: function(_0x8a9b0c, _0x1b2c3d) {
        return function(..._0x3d4e5f) {
            const _0x6e7f8g = _0x1a2b3c['b'](_0x1b2c3d);
            if (_0x7d8e9f[_0x6e7f8g]) {
                return _0x7d8e9f[_0x6e7f8g][_0x1b2c3d](..._0x3d4e5f);
            }
        };
    }
});


onAuthStateChanged(_0x7d8e9f[_0x1a2b3c['b']('auth')], (_0x2c3d4e) => {
    if (_0x2c3d4e) {
        _0x7d8e9f[_0x1a2b3c['b']('currentUser')] = _0x2c3d4e;
        
       
        Promise.all([
            _0x8f9a0b(true),
            _0xa1b2c3(),
            _0xc4d5e6()
        ]).then(() => {
            document.getElementById('message-input').disabled = false;
        }).catch(_0xd7e8f9);
        
    } else {
        _0x7d8e9f[_0x1a2b3c['b']('currentUser')] = null;
        window.location.href = _0x1a2b3c['b']('Giris.html');
    }
});


async function _0x8f9a0b(_0x3e4f5a) {
    if (!_0x7d8e9f[_0x1a2b3c['b']('currentUser')]) return;
    
    const _0x6g7h8i = doc(
        _0x7d8e9f[_0x1a2b3c['b']('db')], 
        _0x1a2b3c['b']('users'), 
        _0x7d8e9f[_0x1a2b3c['b']('currentUser')].uid
    );
    
    await updateDoc(_0x6g7h8i, {
        'online': _0x3e4f5a,
        'lastSeen': serverTimestamp()
    });
}

async function _0xa1b2c3() {
    try {
        if (_0x7d8e9f.userListUnsub) _0x7d8e9f.userListUnsub();
        
        const _0x9i0j1k = query(collection(_0x7d8e9f[_0x1a2b3c['b']('db')], _0x1a2b3c['b']('users')));
        _0x7d8e9f.userListUnsub = onSnapshot(_0x9i0j1k, (_0x2k3l4m) => {
            _0x5n6o7p(_0x2k3l4m);
        }, _0xd7e8f9);
    } catch (_0xe8f9a0) {
        _0xd7e8f9(_0xe8f9a0);
    }
}

function _0x5n6o7p(_0x3l4m5n) {
    const _0x6o7p8q = document.getElementById('conversation-list');
    _0x6o7p8q.innerHTML = '';
    
    _0x3l4m5n.forEach(_0x7p8q9r => {
        const _0x8q9r0s = _0x7p8q9r.data();
        if (_0x8q9r0s.uid === _0x7d8e9f[_0x1a2b3c['b']('currentUser')].uid) return;
        
        const _0x9r0s1t = document.createElement('div');
        _0x9r0s1t.className = 'conversation-item';
        _0x9r0s1t.dataset.uid = _0x8q9r0s.uid;
        _0x9r0s1t.innerHTML = _0xb1c2d3(_0x8q9r0s);
        _0x9r0s1t.addEventListener('click', () => _0xd3e4f5(_0x8q9r0s.uid, _0x8q9r0s.fullname));
        
        _0x6o7p8q.appendChild(_0x9r0s1t);
    });
    
    _0xe4f5g6();
    _0xf5g6h7();
}

function _0xb1c2d3(_0x8q9r0s) {
    return `
        <div class="avatar">${_0x8q9r0s.fullname?.charAt(0) || 'K'}</div>
        <div class="conversation-info">
            <div class="conversation-name">${_0x8q9r0s.fullname || 'Kullanıcı'}</div>
            <div class="last-message">${_0x1a2b3c['b']('Henüz mesaj yok')}</div>
        </div>
        <div class="conversation-meta">
            <div class="timestamp"></div>
            <div class="unread-count" style="display: none;">0</div>
        </div>`;
}


async function _0xc4d5e6() {
    const _0x9a0b1c = document.getElementById('message-input');
    const _0xb1c2d3 = _0x9a0b1c.value.trim();
    
    if (!_0xb1c2d3 || !_0x7d8e9f[_0x1a2b3c['b']('activeChatUID')]) return;

    const _0xd2e3f4 = Date.now();
    const _0xe3f4g5 = `${_0x7d8e9f[_0x1a2b3c['b']('currentUser')].uid}_${_0x7d8e9f[_0x1a2b3c['b']('activeChatUID')]}_${_0xd2e3f4}`;
    
    try {
        await setDoc(doc(_0x7d8e9f[_0x1a2b3c['b']('db')], _0x1a2b3c['b']('messages'), _0xe3f4g5), {
            'sender': _0x7d8e9f[_0x1a2b3c['b']('currentUser')].uid,
            'receiver': _0x7d8e9f[_0x1a2b3c['b']('activeChatUID')],
            'text': _0xb1c2d3,
            'timestamp': serverTimestamp(),
            'read': false,
            'expireAt': Timestamp.fromDate(new Date(Date.now() + 604800000))
        });
        
        _0x9a0b1c.value = '';
    } catch (_0xf4g5h6) {
        _0xd7e8f9(_0xf4g5h6);
    }
}


function _0xd7e8f9(_0xf5g6h7) {
    console.error(_0x1a2b3c['b']('Hata:'), _0xf5g6h7);
}

const _0xe8f9a0 = setInterval(() => {
    _0xf9a0b1();
}, 600000);

const _0xf9a0b1 = async () => {
    const _0xa0b1c2 = new Date();
    const _0xb1c2d3 = query(
        collection(_0x7d8e9f[_0x1a2b3c['b']('db')], _0x1a2b3c['b']('messages')),
        where(_0x1a2b3c['b']('expireAt'), '<=', _0xa0b1c2)
    );
    
    const _0xc2d3e4 = await getDocs(_0xb1c2d3);
    _0xc2d3e4.forEach(async (_0xd3e4f5) => {
        await deleteDoc(doc(_0x7d8e9f[_0x1a2b3c['b']('db')], _0x1a2b3c['b']('messages'), _0xd3e4f5.id));
    });
};


['send-btn', 'refresh-btn', 'logout-btn', 'theme-toggle-btn', 'emoji-picker-btn', 'debug-btn'].forEach(_0xa1b2c3 => {
    document.getElementById(_0xa1b2c3)?.addEventListener('click', _0xc3d4e5[_0xa1b2c3] || function() {});
});

const _0xc3d4e5 = {
    'send-btn': _0xc4d5e6,
    'refresh-btn': _0xa1b2c3,
    'logout-btn': async () => {
        await _0x8f9a0b(false);
        await signOut(_0x7d8e9f[_0x1a2b3c['b']('auth')]);
        window.location.href = _0x1a2b3c['b']('Giris.html');
    },
    'theme-toggle-btn': function() {
        document.body.classList.toggle('night-mode');
        localStorage.setItem('nightMode', document.body.classList.contains('night-mode') ? 'enabled' : 'disabled');
    }
};


function _0xd3e4f5(_0xe4f5g6, _0xf5g6h7) {
    if (_0x7d8e9f.messagesUnsub) _0x7d8e9f.messagesUnsub();
    
    _0x7d8e9f[_0x1a2b3c['b']('activeChatUID')] = _0xe4f5g6;
    _0x7d8e9f.activeChatName = _0xf5g6h7;
    
    const _0x6h7i8j = query(
        collection(_0x7d8e9f[_0x1a2b3c['b']('db')], _0x1a2b3c['b']('messages')), 
        orderBy(_0x1a2b3c['b']('timestamp'), _0x1a2b3c['b']('asc'))
    );
    
    _0x7d8e9f.messagesUnsub = onSnapshot(_0x6h7i8j, _0x7i8j9k => {
        _0x8j9k0l(_0x7i8j9k);
    }, _0xd7e8f9);
}

function _0x8j9k0l(_0x9k0l1m) {
    const _0x0l1m2n = document.getElementById('messages-container');
    _0x0l1m2n.innerHTML = '';
    
    const _0x1m2n3o = _0x9k0l1m.docs.filter(_0x2n3o4p => {
        const _0x3o4p5q = _0x2n3o4p.data();
        return (_0x3o4p5q.sender === _0x7d8e9f[_0x1a2b3c['b']('currentUser')].uid && 
                _0x3o4p5q.receiver === _0x7d8e9f[_0x1a2b3c['b']('activeChatUID')]) ||
               (_0x3o4p5q.sender === _0x7d8e9f[_0x1a2b3c['b']('activeChatUID')] && 
                _0x3o4p5q.receiver === _0x7d8e9f[_0x1a2b3c['b']('currentUser')].uid);
    });
    
    _0x1m2n3o.forEach(_0x4p5q6r => {
        _0x5q6r7s(_0x4p5q6r, _0x0l1m2n);
    });
    
    _0x0l1m2n.scrollTop = _0x0l1m2n.scrollHeight;
}

function _0x5q6r7s(_0x6r7s8t, _0x7s8t9u) {
    const _0x8t9u0v = _0x6r7s8t.data();
    const _0x9u0v1w = document.createElement('div');
    
    _0x9u0v1w.className = _0x8t9u0v.sender === _0x7d8e9f[_0x1a2b3c['b']('currentUser')].uid ? 
        'message-sent' : 'message-received';
    
    _0x9u0v1w.innerHTML = `
        <div class="message-content">
            <div class="message-text">${_0x8t9u0v.text || ''}</div>
            <div class="message-time">${_0xa2b3c4(new Date((_0x8t9u0v.timestamp?.seconds || 0) * 1000))}</div>
        </div>`;
    
    _0x7s8t9u.appendChild(_0x9u0v1w);
}

function _0xa2b3c4(_0xb3c4d5) {
    const _0xc4d5e6 = new Date();
    const _0xd5e6f7 = _0xc4d5e6 - _0xb3c4d5;
    
    if (_0xd5e6f7 < 60000) return _0x1a2b3c['b']('şimdi');
    if (_0xd5e6f7 < 3600000) return `${Math.floor(_0xd5e6f7/60000)} ${_0x1a2b3c['b']('dk')}`;
    if (_0xd5e6f7 < 86400000) return _0xb3c4d5.toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'});
    return _0xb3c4d5.toLocaleDateString('tr-TR', {day:'numeric', month:'short'});
}


function _0xe4f5g6() {
    if (_0x7d8e9f.lastMessagesUnsub) _0x7d8e9f.lastMessagesUnsub();
    
    const _0xf5g6h7 = query(
        collection(_0x7d8e9f[_0x1a2b3c['b']('db')], _0x1a2b3c['b']('messages')), 
        orderBy(_0x1a2b3c['b']('timestamp'), _0x1a2b3c['b']('desc'))
    );
    
    _0x7d8e9f.lastMessagesUnsub = onSnapshot(_0xf5g6h7, _0x6h7i8j => {
        _0x7i8j9k(_0x6h7i8j);
    }, _0xd7e8f9);
}

function _0x7i8j9k(_0x8j9k0l) {
    const _0x9k0l1m = {};
    
    _0x8j9k0l.forEach(_0x0l1m2n => {
        const _0x1m2n3o = _0x0l1m2n.data();
        if (_0x1m2n3o.sender === _0x7d8e9f[_0x1a2b3c['b']('currentUser')].uid || 
            _0x1m2n3o.receiver === _0x7d8e9f[_0x1a2b3c['b']('currentUser')].uid) {
            
            const _0x2n3o4p = _0x1m2n3o.sender === _0x7d8e9f[_0x1a2b3c['b']('currentUser')].uid ? 
                _0x1m2n3o.receiver : _0x1m2n3o.sender;
            
            if (!_0x9k0l1m[_0x2n3o4p]) {
                _0x9k0l1m[_0x2n3o4p] = {
                    'text': _0x1m2n3o.text,
                    'timestamp': _0x1m2n3o.timestamp,
                    'isSender': _0x1m2n3o.sender === _0x7d8e9f[_0x1a2b3c['b']('currentUser')].uid
                };
            }
        }
    });
    
    _0x3o4p5q(_0x9k0l1m);
}

function _0x3o4p5q(_0x4p5q6r) {
    document.querySelectorAll('.conversation-item').forEach(_0x5q6r7s => {
        const _0x6r7s8t = _0x5q6r7s.dataset.uid;
        const _0x7s8t9u = _0x4p5q6r[_0x6r7s8t];
        
        if (_0x7s8t9u) {
            const _0x8t9u0v = _0x5q6r7s.querySelector('.last-message');
            const _0x9u0v1w = _0x5q6r7s.querySelector('.timestamp');
            
            _0x8t9u0v.textContent = _0x7s8t9u.isSender ? 
                `${_0x1a2b3c['b']('Sen:')} ${_0x7s8t9u.text}` : _0x7s8t9u.text;
            
            if (_0x7s8t9u.timestamp?.seconds) {
                _0x9u0v1w.textContent = _0xa2b3c4(new Date(_0x7s8t9u.timestamp.seconds * 1000));
            }
        }
    });
}


function _0xf5g6h7() {
    const _0x6h7i8j = query(collection(_0x7d8e9f[_0x1a2b3c['b']('db')], _0x1a2b3c['b']('users')));
    
    onSnapshot(_0x6h7i8j, _0x7i8j9k => {
        _0x7i8j9k.forEach(_0x8j9k0l => {
            const _0x9k0l1m = _0x8j9k0l.data();
            if (_0x9k0l1m.uid === _0x7d8e9f[_0x1a2b3c['b']('currentUser')].uid) return;
            
            const _0x0l1m2n = document.querySelector(`.conversation-item[data-uid="${_0x9k0l1m.uid}"]`);
            if (_0x0l1m2n) {
                const _0x1m2n3o = _0x0l1m2n.querySelector('.avatar');
                _0x1m2n3o.querySelector('.online-status-indicator')?.remove();
                
                const _0x2n3o4p = document.createElement('div');
                _0x2n3o4p.className = `online-status-indicator ${_0x9k0l1m.online ? 'online' : 'offline'}`;
                _0x1m2n3o.appendChild(_0x2n3o4p);
            }
        });
    });
}


window.addEventListener('beforeunload', () => {
    ['messagesUnsub', 'onlineStatusUnsub', 'userListUnsub', 'lastMessagesUnsub'].forEach(_0x3o4p5q => {
        if (_0x7d8e9f[_0x3o4p5q]) _0x7d8e9f[_0x3o4p5q]();
    });
    
    _0x8f9a0b(false);
});


document.addEventListener('DOMContentLoaded', function() {
    
    if (localStorage.getItem('nightMode') === 'enabled') {
        document.body.classList.add('night-mode');
    }

    const _0x4p5q6r = ['😀', '😂', '😍', '🥰', '😎', '🙄', '😮', '😢', '😡', '🤢', '❤️', '👍', '👎', '🔥', '🎉', '🤔', '👀', '🙏'];
    const _0x5q6r7s = document.querySelector('.emoji-grid');
    
    _0x4p5q6r.forEach(_0x6r7s8t => {
        const _0x7s8t9u = document.createElement('div');
        _0x7s8t9u.className = 'emoji';
        _0x7s8t9u.textContent = _0x6r7s8t;
        _0x7s8t9u.addEventListener('click', () => {
            document.getElementById('message-input').value += _0x6r7s8t;
        });
        _0x5q6r7s.appendChild(_0x7s8t9u);
    });
});


(function() {
    const _0x8t9u0v = document.querySelector('.menu-toggle');
    const _0x9u0v1w = document.querySelector('.sidebar');
    const _0xa0v1w2 = document.querySelector('.overlay');
    
    _0x8t9u0v?.addEventListener('click', () => {
        _0x9u0v1w.classList.toggle('active');
        _0xa0v1w2.classList.toggle('active');
    });
    
    _0xa0v1w2?.addEventListener('click', () => {
        _0x9u0v1w.classList.remove('active');
        _0xa0v1w2.classList.remove('active');
    });
})();

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




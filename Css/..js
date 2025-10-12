
    // Firebase App ve modüller
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
    import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
    import { 
        getFirestore, collection, doc, setDoc, getDocs, query, where, orderBy, 
        onSnapshot, serverTimestamp, Timestamp, deleteDoc, updateDoc 
    } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

    // Firebase yapılandırması
    const firebaseConfig = {
        apiKey: "AIzaSyBG7k-zFAXQ37vhKtjGRJDT5ZiGBPQhqT4",
        authDomain: "fisilda-4d414.firebaseapp.com",
        projectId: "fisilda-4d414",
        storageBucket: "fisilda-4d414.firebasestorage.app",
        messagingSenderId: "857850492179",
        appId: "1:857850492179:web:0b57c6314ca58a4daed6e6"
    };

    // Firebase'i başlat
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Global değişkenler
    let currentUser = null;
    let activeChatUID = null;
    let activeChatName = null;
    let messagesUnsubscribe = null;
    let onlineStatusUnsubscribe = null;
    let userListUnsubscribe = null;
    let lastMessagesUnsubscribe = null;

    // Hata ayıklama paneli
    document.getElementById('debug-btn').addEventListener('click', () => {
        const debugPanel = document.getElementById('debug-panel');
        debugPanel.style.display = debugPanel.style.display === 'block' ? 'none' : 'block';
        updateDebugInfo('Hata ayıklama paneli açıldı.');
    });

    function updateDebugInfo(message) {
        const debugContent = document.getElementById('debug-content');
        debugContent.innerHTML += `<div>${new Date().toLocaleTimeString()}: ${message}</div>`;
        debugContent.scrollTop = debugContent.scrollHeight;
    }

    // Gece modu işlevi
    document.getElementById('theme-toggle-btn').addEventListener('click', toggleNightMode);
    
    function toggleNightMode() {
        document.body.classList.toggle('night-mode');
        const icon = document.getElementById('theme-toggle-btn').querySelector('i');
        if (document.body.classList.contains('night-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('nightMode', 'enabled');
            updateDebugInfo('Gece modu açıldı.');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('nightMode', 'disabled');
            updateDebugInfo('Gece modu kapatıldı.');
        }
    }
    
    // Sayfa yüklendiğinde gece modu durumunu kontrol et
    if (localStorage.getItem('nightMode') === 'enabled') {
        document.body.classList.add('night-mode');
        const icon = document.getElementById('theme-toggle-btn').querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    // Emoji picker işlevi
    const emojiPicker = document.getElementById('emoji-picker');
    const emojiBtn = document.getElementById('emoji-picker-btn');
    const messageInput = document.getElementById('message-input');
    
    // Popüler emojiler
    const popularEmojis = ['😀', '😂', '😍', '🥰', '😎', '🙄', '😮', '😢', '😡', '🤢', '❤️', '👍', '👎', '🔥', '🎉', '🤔', '👀', '🙏'];
    
    // Emoji grid oluştur
    const emojiGrid = document.querySelector('.emoji-grid');
    popularEmojis.forEach(emoji => {
        const emojiElement = document.createElement('div');
        emojiElement.classList.add('emoji');
        emojiElement.textContent = emoji;
        emojiElement.addEventListener('click', () => {
            messageInput.value += emoji;
            messageInput.focus();
        });
        emojiGrid.appendChild(emojiElement);
    });
    
    // Emoji picker'ı göster/gizle
    emojiBtn.addEventListener('click', () => {
        emojiPicker.classList.toggle('active');
    });
    
    // Dışarı tıklandığında emoji picker'ı kapat
    document.addEventListener('click', (e) => {
        if (!emojiBtn.contains(e.target) && !emojiPicker.contains(e.target)) {
            emojiPicker.classList.remove('active');
        }
    });

    // Auth state kontrolü
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            updateDebugInfo(`Kullanıcı giriş yaptı: ${user.uid}`);
            // Çevrimiçi durumunu güncelle
            updateOnlineStatus(true);
            loadUserList();
            document.getElementById('message-input').disabled = false;
            document.querySelector('.welcome-message').style.display = 'flex';
        } else {
            currentUser = null;
            updateDebugInfo('Kullanıcı çıkış yaptı.');
            // Çevrimdışı durumunu güncelle
            if (onlineStatusUnsubscribe) onlineStatusUnsubscribe();
            if (userListUnsubscribe) userListUnsubscribe();
            if (lastMessagesUnsubscribe) lastMessagesUnsubscribe();
            window.location.href = 'Giris.html';
        }
    });
    
    // Çevrimiçi durumunu güncelleme
    function updateOnlineStatus(online) {
        if (!currentUser) return;
        
        const userRef = doc(db, "users", currentUser.uid);
        updateDoc(userRef, {
            online: online,
            lastSeen: serverTimestamp()
        }).catch(error => {
            console.error("Çevrimiçi durumu güncellenemedi:", error);
            updateDebugInfo(`Çevrimiçi durum hatası: ${error.message}`);
        });
    }

    // Yenile butonu
    document.getElementById('refresh-btn').addEventListener('click', () => {
        updateDebugInfo('Sayfa yenileniyor...');
        loadUserList();
        if (activeChatUID) listenMessages();
    });

    // Çıkış butonu
    document.getElementById('logout-btn').addEventListener('click', async () => {
        try {
            // Çevrimdışı durumunu güncelle
            updateOnlineStatus(false);
            await signOut(auth);
            updateDebugInfo('Çıkış yapıldı.');
            window.location.href = 'Giris.html';
        } catch (error) {
            console.error('Çıkış yapılamadı:', error);
            updateDebugInfo(`Çıkış hatası: ${error.message}`);
        }
    });

    // Kullanıcı listesi
    async function loadUserList() {
        try {
            updateDebugInfo('Kullanıcı listesi yükleniyor...');
            
            if (userListUnsubscribe) userListUnsubscribe();
            
            const usersQuery = query(collection(db, "users"));
            userListUnsubscribe = onSnapshot(usersQuery, (usersSnapshot) => {
                const conversationList = document.getElementById('conversation-list');

                if (usersSnapshot.empty) {
                    conversationList.innerHTML = `<div style="text-align:center;padding:20px;color:#777;">
                        <i class="fas fa-users" style="font-size:2rem;margin-bottom:10px;"></i>
                        <p>Henüz hiç kullanıcı bulunamadı</p></div>`;
                    updateDebugInfo('Kullanıcı koleksiyonu boş.');
                    return;
                }

                conversationList.innerHTML = '';
                let hasOtherUsers = false;

                usersSnapshot.forEach(docSnap => {
                    const userData = docSnap.data();
                    if (userData.uid === currentUser.uid) return;
                    hasOtherUsers = true;

                    const item = document.createElement('div');
                    item.className = 'conversation-item';
                    item.dataset.uid = userData.uid;
                    item.innerHTML = `
                        <div class="avatar">${userData.fullname?.charAt(0) || 'K'}</div>
                        <div class="conversation-info">
                            <div class="conversation-name">${userData.fullname || 'Kullanıcı'}</div>
                            <div class="last-message">Henüz mesaj yok</div>
                        </div>
                        <div class="conversation-meta">
                            <div class="timestamp"></div>
                            <div class="unread-count" style="display: none;">0</div>
                        </div>`;
                    
                    item.addEventListener('click', () => {
                        openChat(userData.uid, userData.fullname);
                        if (window.innerWidth <= 768) {
                            document.querySelector('.sidebar').classList.remove('active');
                            document.querySelector('.overlay').classList.remove('active');
                        }
                    });

                    conversationList.appendChild(item);
                });

                if (!hasOtherUsers) {
                    conversationList.innerHTML = `<div style="text-align:center;padding:20px;color:#777;">
                        <i class="fas fa-users" style="font-size:2rem;margin-bottom:10px;"></i>
                        <p>Henüz başka kullanıcı bulunamadı</p></div>`;
                    updateDebugInfo('Başka kullanıcı bulunamadı.');
                } else {
                    updateDebugInfo('Kullanıcı listesi başarıyla yüklendi.');
                    loadLastMessages();
                    listenToAllUsersStatus();
                }
            }, error => {
                console.error("Kullanıcı listesi yüklenemedi:", error);
                updateDebugInfo(`Kullanıcı listesi hatası: ${error.message}`);
            });

        } catch (error) {
            console.error("Kullanıcı listesi yüklenemedi:", error);
            updateDebugInfo(`Kullanıcı listesi hatası: ${error.message}`);
        }
    }

    // Tüm kullanıcıların çevrimiçi durumunu dinle
    function listenToAllUsersStatus() {
        const usersQuery = query(collection(db, "users"));
        
        onSnapshot(usersQuery, (snapshot) => {
            snapshot.forEach((doc) => {
                const userData = doc.data();
                if (userData.uid === currentUser.uid) return;
                
                const userItem = document.querySelector(`.conversation-item[data-uid="${userData.uid}"]`);
                if (userItem) {
                    const avatarContainer = userItem.querySelector('.avatar');
                    
                    // Önceki durum göstergesini temizle
                    avatarContainer.querySelector('.online-status-indicator')?.remove();
                    
                    // Yeni durum göstergesi ekle
                    const statusIndicator = document.createElement('div');
                    statusIndicator.className = `online-status-indicator ${userData.online ? 'online' : 'offline'}`;
                    avatarContainer.appendChild(statusIndicator);
                }
            });
        });
    }

    // Son mesajlar ve okunmamış mesaj sayıları
    function loadLastMessages() {
        try {
            if (lastMessagesUnsubscribe) lastMessagesUnsubscribe();
            
            const messagesQuery = query(collection(db, "messages"), orderBy("timestamp", "desc"));
            lastMessagesUnsubscribe = onSnapshot(messagesQuery, snapshot => {
                const lastMessages = {};
                const unreadCounts = {};
                
                // Önce tüm mesajları işle
                snapshot.forEach(docSnap => {
                    const data = docSnap.data();
                    if (data.sender === currentUser.uid || data.receiver === currentUser.uid) {
                        const otherUser = data.sender === currentUser.uid ? data.receiver : data.sender;
                        
                        // Son mesajı kaydet
                        if (!lastMessages[otherUser]) {
                            lastMessages[otherUser] = { 
                                text: data.text, 
                                timestamp: data.timestamp, 
                                isSender: data.sender === currentUser.uid 
                            };
                        }
                        
                        // Okunmamış mesaj sayısını hesapla (sadece aktif sohbet dışındakiler için)
                        if (data.receiver === currentUser.uid && !data.read && activeChatUID !== otherUser) {
                            unreadCounts[otherUser] = (unreadCounts[otherUser] || 0) + 1;
                        }
                    }
                });

                // Tüm konuşma öğelerini güncelle
                document.querySelectorAll('.conversation-item').forEach(item => {
                    const uid = item.dataset.uid;
                    const lastMessage = lastMessages[uid];
                    const unreadCount = unreadCounts[uid] || 0;
                    
                    const lastMessageEl = item.querySelector('.last-message');
                    const timestampEl = item.querySelector('.timestamp');
                    const unreadCountEl = item.querySelector('.unread-count');
                    
                    if (lastMessage) {
                        lastMessageEl.textContent = lastMessage.isSender ? `Sen: ${lastMessage.text}` : lastMessage.text;
                        if (lastMessage.timestamp && lastMessage.timestamp.seconds) {
                            const date = new Date(lastMessage.timestamp.seconds * 1000);
                            timestampEl.textContent = formatTime(date);
                        }
                    }
                    
                    // Okunmamış mesaj sayısını göster/gizle
                    if (unreadCount > 0) {
                        unreadCountEl.textContent = unreadCount;
                        unreadCountEl.style.display = 'flex';
                    } else {
                        unreadCountEl.style.display = 'none';
                    }
                });
                
                // Konuşmaları son mesaj zamanına göre sırala
                sortConversationsByLastMessage();
            });
        } catch (error) {
            console.error("Son mesajlar yüklenemedi:", error);
            updateDebugInfo(`Son mesajlar hatası: ${error.message}`);
        }
    }

    // Konuşmaları son mesaj zamanına göre sırala
    function sortConversationsByLastMessage() {
        const conversationList = document.getElementById('conversation-list');
        const items = Array.from(conversationList.querySelectorAll('.conversation-item'));
        
        items.sort((a, b) => {
            const aTime = a.querySelector('.timestamp').textContent;
            const bTime = b.querySelector('.timestamp').textContent;
            
            // Zaman damgası olmayanları en alta at
            if (!aTime && !bTime) return 0;
            if (!aTime) return 1;
            if (!bTime) return -1;
            
            // Son mesaj zamanına göre sırala (yeniden eskiye)
            return aTime < bTime ? 1 : -1;
        });
        
        // Öğeleri yeniden sırala
        items.forEach(item => conversationList.appendChild(item));
    }

    // Zaman formatı
    function formatTime(date) {
        const now = new Date();
        const diff = now - date;
        if (diff < 60000) return 'şimdi';
        if (diff < 3600000) return `${Math.floor(diff/60000)} dk`;
        if (diff < 86400000) return date.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
        return date.toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
    }

    // Chat açma
    function openChat(uid, name) {
        if (messagesUnsubscribe) messagesUnsubscribe();
        if (onlineStatusUnsubscribe) onlineStatusUnsubscribe();
        
        activeChatUID = uid;
        activeChatName = name;
        document.getElementById('current-chat-name').textContent = name;
        document.getElementById('current-chat-avatar').textContent = name.charAt(0);
        document.getElementById('send-btn').disabled = false;
        updateDebugInfo(`${name} ile sohbet açıldı.`);
        
        // Okunmamış mesajları "görüldü" olarak işaretle
        markMessagesAsRead(uid);
        
        // Okunmamış mesaj sayısını sıfırla
        const unreadCountEl = document.querySelector(`.conversation-item[data-uid="${uid}"] .unread-count`);
        if (unreadCountEl) {
            unreadCountEl.style.display = 'none';
        }
        
        // Çevrimiçi durumunu dinle
        listenToOnlineStatus(uid);
        listenMessages();
    }

    // Mesajları "görüldü" olarak işaretle
    async function markMessagesAsRead(uid) {
        try {
            // Okunmamış mesajları bul
            const unreadMessagesQuery = query(
                collection(db, "messages"),
                where("sender", "==", uid),
                where("receiver", "==", currentUser.uid),
                where("read", "==", false)
            );
            
            const unreadMessagesSnapshot = await getDocs(unreadMessagesQuery);
            
            // Tüm okunmamış mesajları "görüldü" olarak işaretle
            const updatePromises = [];
            unreadMessagesSnapshot.forEach((docSnap) => {
                updatePromises.push(updateDoc(doc(db, "messages", docSnap.id), {
                    read: true,
                    readAt: serverTimestamp()
                }));
            });
            
            await Promise.all(updatePromises);
            updateDebugInfo(`${unreadMessagesSnapshot.size} mesaj görüldü olarak işaretlendi.`);
            
        } catch (error) {
            console.error("Mesajlar görüldü olarak işaretlenemedi:", error);
            updateDebugInfo(`Mesaj görüldü işaretleme hatası: ${error.message}`);
        }
    }

    // Çevrimiçi durumunu dinleme
    function listenToOnlineStatus(uid) {
        const userRef = doc(db, "users", uid);
        
        onlineStatusUnsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                const userData = doc.data();
                const isOnline = userData.online;
                const lastSeen = userData.lastSeen;
                
                const statusElement = document.getElementById('current-chat-status');
                const statusDot = document.getElementById('status-dot');
                const onlineStatus = document.getElementById('online-status');
                
                if (isOnline) {
                    statusElement.textContent = 'çevrimiçi';
                    statusDot.classList.remove('offline');
                    onlineStatus.classList.remove('offline');
                } else {
                    statusElement.textContent = 'çevrimdışı';
                    if (lastSeen && lastSeen.seconds) {
                        const lastSeenDate = new Date(lastSeen.seconds * 1000);
                        statusElement.textContent = `çevrimdışı (${formatTime(lastSeenDate)})`;
                    }
                    statusDot.classList.add('offline');
                    onlineStatus.classList.add('offline');
                }
            }
        }, error => {
            console.error("Çevrimiçi durum dinlenirken hata:", error);
            updateDebugInfo(`Çevrimiçi durum dinleme hatası: ${error.message}`);
        });
    }

    // Mesaj gönderme
    async function sendMessage() {
        const messageInput = document.getElementById('message-input');
        const messageText = messageInput.value.trim();
        if (!messageText || !activeChatUID) return;

        const timestamp = Date.now();
        const docId = `${currentUser.uid}_${activeChatUID}_${timestamp}`;
        try {
            await setDoc(doc(db,"messages",docId),{
                sender: currentUser.uid,
                receiver: activeChatUID,
                text: messageText,
                timestamp: serverTimestamp(),
                read: false, // Mesaj başlangıçta okunmamış olarak işaretlenir
                expireAt: Timestamp.fromDate(new Date(Date.now() + 7*24*60*60*1000))
            });
            messageInput.value = '';
            updateDebugInfo(`Mesaj gönderildi: ${messageText}`);
        } catch(error) {
            console.error("Mesaj gönderilemedi:", error.message);
            updateDebugInfo(`Mesaj gönderme hatası: ${error.message}`);
        }
    }

    // Mesaj silme
    async function deleteMessage(messageId) {
        try {
            await deleteDoc(doc(db, "messages", messageId));
            updateDebugInfo(`Mesaj silindi: ${messageId}`);
        } catch (error) {
            console.error("Mesaj silinemedi:", error);
            updateDebugInfo(`Mesaj silme hatası: ${error.message}`);
            alert("Mesaj silinirken bir hata oluştu.");
        }
    }

    // Mesajları dinleme
    function listenMessages() {
        if (!activeChatUID) return;
        const messagesContainer = document.getElementById('messages-container');
        messagesContainer.innerHTML = '<div class="message-loading"><i class="fas fa-spinner fa-spin"></i> Mesajlar yükleniyor...</div>';
        updateDebugInfo(`Mesajlar dinleniyor: ${currentUser.uid} ve ${activeChatUID}`);
        const messagesQuery = query(collection(db,"messages"), orderBy("timestamp","asc"));

        if (messagesUnsubscribe) messagesUnsubscribe();
        messagesUnsubscribe = onSnapshot(messagesQuery, snapshot => {
            const filteredMessages = snapshot.docs.filter(docSnap => {
                const data = docSnap.data();
                return (data.sender===currentUser.uid && data.receiver===activeChatUID) ||
                       (data.sender===activeChatUID && data.receiver===currentUser.uid);
            });

            messagesContainer.innerHTML = '';
            if (filteredMessages.length===0){
                messagesContainer.innerHTML = `<div class="message-error">
                    <i class="fas fa-comment-slash"></i>
                    <p>Henüz mesaj yok</p><p>İlk mesajı sen gönder!</p></div>`;
                return;
            }

            filteredMessages.forEach(docSnap=>{
                const data = docSnap.data();
                const div = document.createElement('div');
                div.className = data.sender===currentUser.uid?'message-sent':'message-received';
                let timestamp = new Date();
                if(data.timestamp && data.timestamp.seconds) timestamp = new Date(data.timestamp.seconds*1000);
                
                // Mesaj okundu bilgisi
                let statusText = '';
                if (data.sender === currentUser.uid) {
                    statusText = data.read ? 'Görüldü' : 'Gönderildi';
                    if (data.read && data.readAt && data.readAt.seconds) {
                        const readTime = new Date(data.readAt.seconds * 1000);
                        statusText = `Görüldü ${formatTime(readTime)}`;
                    }
                }
                
                div.innerHTML = `
                    <div class="message-content">
                        <div class="message-text">${data.text||''}</div>
                        <div class="message-time">${formatTime(timestamp)}</div>
                        ${data.sender===currentUser.uid ? 
                            `<div class="message-status">${statusText}</div>
                            <div class="message-actions">
                                <button class="delete-message-btn" data-id="${docSnap.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>` : ''}
                    </div>`;
                
                messagesContainer.appendChild(div);
            });
            
            // Silme butonlarına event listener ekle
            document.querySelectorAll('.delete-message-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const messageId = btn.getAttribute('data-id');
                    if (confirm('Bu mesajı silmek istediğinize emin misiniz?')) {
                        deleteMessage(messageId);
                    }
                });
            });
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, error=>{
            console.error("Mesajlar dinlenirken hata oluştu:",error);
            updateDebugInfo(`Mesaj dinleme hatası: ${error.message}`);
            messagesContainer.innerHTML = `<div class="message-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Mesajlar yüklenirken hata oluştu</p>
                <button class="retry-button" onclick="listenMessages()">Tekrar Dene</button>
            </div>`;
        });
    }

    // Event listenerlar
    document.getElementById('send-btn').addEventListener('click',sendMessage);
    document.getElementById('message-input').addEventListener('keypress',e=>{if(e.key==='Enter') sendMessage();});

    // Hover efektleri
    document.querySelectorAll('button').forEach(btn=>{
        btn.addEventListener('mouseenter',()=>{btn.style.transform='translateY(-2px)';});
        btn.addEventListener('mouseleave',()=>{btn.style.transform='';});
    });

    // Sayfa kapatılırken dinleyici temizle
    window.addEventListener('beforeunload',()=>{
        if (messagesUnsubscribe) messagesUnsubscribe();
        if (onlineStatusUnsubscribe) onlineStatusUnsubscribe();
        if (userListUnsubscribe) userListUnsubscribe();
        if (lastMessagesUnsubscribe) lastMessagesUnsubscribe();
        // Çevrimdışı durumunu güncelle
        updateOnlineStatus(false);
    });

    // Responsive menü
    document.addEventListener('DOMContentLoaded',function(){
        const menuToggle=document.querySelector('.menu-toggle');
        const sidebar=document.querySelector('.sidebar');
        const overlay=document.querySelector('.overlay');
        const backButton=document.querySelector('.back-button');

        if(menuToggle && sidebar){
            menuToggle.addEventListener('click',()=> {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
                document.body.style.overflow=sidebar.classList.contains('active')?'hidden':'';
            });
        }

        if(overlay){
            overlay.addEventListener('click',()=> {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow='';
            });
        }

        if(backButton){
            backButton.addEventListener('click',()=>{
                if(window.innerWidth<=768){
                    sidebar.classList.add('active');
                    overlay.classList.add('active');
                }
            });
        }

        window.addEventListener('resize',()=>{
            if(window.innerWidth>768){
                sidebar.classList.remove('active');
                if(overlay) overlay.classList.remove('active');
                document.body.style.overflow='';
            }
        });
    });

    // 7 gün geçmiş mesajları silme
    async function deleteExpiredMessages(){
        const now=new Date();
        const messagesRef=collection(db,"messages");
        const q=query(messagesRef,where("expireAt","<=",now));
        const querySnapshot=await getDocs(q);
        querySnapshot.forEach(async docSnap=>{
            await deleteDoc(doc(db,"messages",docSnap.id));
            updateDebugInfo(`Mesaj otomatik silindi: ${docSnap.id}`);
        });
    }

    // Sayfa açılırken ve her 10 dakikada bir kontrol
    deleteExpiredMessages();
    setInterval(deleteExpiredMessages,10*60*1000);

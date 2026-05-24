// const socket = io(window.location.origin, {
//     transports: ['websocket'],
//     upgrade: false,
//     reconnection: true,
//     reconnectionAttempts: Infinity,
//     reconnectionDelay: 1000
// });

// let currentUser = JSON.parse(localStorage.getItem('whatsapp_user')) || null;
// let activeChatPartner = null;
// let isLoginView = true;
// let RENDERING_TRACKER_IDS = new Set();

// // UI Elements Mapping Nodes
// const authContainer = document.getElementById('auth-container');
// const appContainer = document.getElementById('app-container');
// const authTitle = document.getElementById('auth-title');
// const nameField = document.getElementById('name-field');
// const authBtn = document.getElementById('auth-btn');
// const authToggleBtn = document.getElementById('auth-toggle-btn');
// const authToggleText = document.getElementById('auth-toggle-text');
// const authName = document.getElementById('auth-name');
// const authMobile = document.getElementById('auth-mobile');
// const authPassword = document.getElementById('auth-password');

// const sidebarPanel = document.getElementById('sidebar-panel');
// const chatPanel = document.getElementById('chat-panel');
// const mobileBackBtn = document.getElementById('mobile-back-btn');

// const userAvatar = document.getElementById('user-avatar');
// const userDisplayName = document.getElementById('user-display-name');
// const usersList = document.getElementById('users-list');
// const logoutBtn = document.getElementById('logout-btn');

// const contactMobileInput = document.getElementById('contact-mobile-input');
// const addContactBtn = document.getElementById('add-contact-btn');

// const chatWelcome = document.getElementById('chat-welcome');
// const activeChatName = document.getElementById('active-chat-name');
// const activeChatAvatar = document.getElementById('active-chat-avatar');
// const chatMessagesBox = document.getElementById('chat-messages-box');
// const chatForm = document.getElementById('chat-form');

// const API_BASE = window.location.origin;

// // ================= DYNAMIC MESSAGE GRAPHIC INJECTOR =================
// function appendMessageBubble(msg) {
//     if (!chatMessagesBox || !msg.id) return;

//     // Strict duplication prevention check
//     if (RENDERING_TRACKER_IDS.has(msg.id)) return;
//     RENDERING_TRACKER_IDS.add(msg.id);

//     const isSentByMe = String(msg.sender).trim() === String(currentUser.mobile).trim();
//     const msgRow = document.createElement('div');
//     msgRow.className = `flex w-full mb-2 ${isSentByMe ? 'justify-end' : 'justify-start'}`;

//     const bubbleStyle = isSentByMe
//         ? 'bg-[#005c4b] text-[#e9edef] rounded-tl-lg rounded-bl-lg rounded-br-lg'
//         : 'bg-[#202c33] text-[#e9edef] rounded-tr-lg rounded-bl-lg rounded-br-lg';

//     const msgId = msg.id;
//     const cleanMessage = msg.message || "";
//     const isCode = /<[a-z][\s\S]*>/i.test(cleanMessage) || cleanMessage.includes('{') || cleanMessage.includes('function');

//     let contentHTML = '';
//     if (isCode) {
//         const escapedCode = cleanMessage.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//         contentHTML = `
//         <div class="mt-1 mb-2 font-sans w-full min-w-[240px]">
//             <div class="flex items-center justify-between bg-[#111a21] px-2 py-1.5 rounded-t text-xs text-gray-400 border-b border-gray-700/50 select-none">
//                 <span class="font-mono text-[11px] text-emerald-400"><i class="fas fa-code mr-1"></i> Code Detected</span>
//                 <button type="button" onclick="toggleMessageMode('${msgId}')" class="bg-[#00a884] text-[#111a21] font-bold px-2 py-0.5 rounded text-[11px]">Toggle Mode</button>
//             </div>
//             <pre id="code-view-${msgId}" class="block bg-[#111a21] p-2.5 rounded-b text-amber-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-[250px] select-text">${escapedCode}</pre>
//             <div id="design-view-${msgId}" class="hidden bg-white text-black p-3 rounded-b overflow-auto max-h-[250px] select-text">${cleanMessage}</div>
//         </div>`;
//     } else {
//         contentHTML = `<p class="pb-1 pr-6 whitespace-pre-wrap select-text text-[14.5px]">${cleanMessage}</p>`;
//     }

//     msgRow.innerHTML = `
//     <div class="max-w-[85%] md:max-w-[70%] min-w-[90px] px-3 py-1.5 shadow-sm leading-tight break-words relative ${bubbleStyle}">
//         ${contentHTML}
//         <span class="absolute bottom-0.5 right-1.5 text-[9px] text-gray-400 select-none flex items-center space-x-0.5">
//             <span>${msg.time || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
//             ${isSentByMe ? '<i class="fas fa-check-double text-sky-400 text-[10px]"></i>' : ''}
//         </span>
//     </div>`;

//     chatMessagesBox.appendChild(msgRow);
//     chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
// }

// window.toggleMessageMode = function(msgId) {
//     const codeLayer = document.getElementById(`code-view-${msgId}`);
//     const designLayer = document.getElementById(`design-view-${msgId}`);
//     if (codeLayer && designLayer) {
//         if (codeLayer.classList.contains('block')) {
//             codeLayer.classList.replace('block', 'hidden'); designLayer.classList.replace('hidden', 'block');
//         } else {
//             designLayer.classList.replace('block', 'hidden'); codeLayer.classList.replace('hidden', 'block');
//         }
//     }
// };

// // ================= FIXED ENGINE EMITTER (SINGLE BINDING) =================
// function initMessagingEngine() {
//     if (!chatForm) return;

//     chatForm.onsubmit = function(e) {
//         e.preventDefault();

//         const chatInputText = document.getElementById('chat-input');
//         if (!chatInputText) return false;

//         const text = chatInputText.value.trim();
//         if (!text || !activeChatPartner || !currentUser) return false;

//         const payload = {
//             sender: String(currentUser.mobile).trim(),
//             receiver: String(activeChatPartner.mobile).trim(),
//             message: text
//         };

//         chatInputText.value = ""; // Text field reset instantly for hyper-responsiveness
//         socket.emit('sendPrivateMessage', payload);
//         chatInputText.focus();
        
//         return false;
//     };
// }

// // ================= SOCKET EVENT CAPTURES =================
// socket.on('connect', () => {
//     if (currentUser) {
//         socket.emit('join', String(currentUser.mobile).trim());
//     }
// });

// socket.on('reconnect', () => {
//     if (currentUser) {
//         socket.emit('join', String(currentUser.mobile).trim());
//     }
// });

// socket.on('newPrivateMessage', (incomingMsg) => {
//     if (!activeChatPartner || !currentUser) return;
    
//     const s = String(incomingMsg.sender).trim();
//     const r = String(incomingMsg.receiver).trim();
//     const activePMob = String(activeChatPartner.mobile).trim();
//     const loggedMob = String(currentUser.mobile).trim();

//     // Agar message active chat user se aaya hai ya maine bheja hai toh bina page click ke live render karega
//     if ((s === loggedMob && r === activePMob) || (s === activePMob && r === loggedMob)) {
//         appendMessageBubble(incomingMsg);
//     }
// });

// // Switch active chat handler
// async function loadChatHistory() {
//     if (!currentUser || !activeChatPartner) return;
//     try {
//         const res = await fetch(`${API_BASE}/api/history?sender=${currentUser.mobile}&receiver=${activeChatPartner.mobile}`);
//         const currentLivePackets = await res.json();
//         if (Array.isArray(currentLivePackets)) {
//             currentLivePackets.forEach(msg => appendMessageBubble(msg));
//         }
//     } catch(e) {}
// }

// // ================= CLIENT ROUTING AND LIFECYCLE =================
// window.addEventListener('DOMContentLoaded', () => {
//     if (currentUser) { initApplication(); } else { toggleAuthView(true); }
// });

// authToggleBtn.addEventListener('click', () => { isLoginView = !isLoginView; toggleAuthView(isLoginView); });

// function toggleAuthView(isLogin) {
//     if (isLogin) {
//         authTitle.innerText = "Sign in to WhatsApp"; nameField.classList.add('hidden'); authBtn.innerText = "Log In";
//         authToggleText.innerText = "Don't have an account?"; authToggleBtn.innerText = "Register Now";
//     } else {
//         authTitle.innerText = "Create Account"; nameField.classList.remove('hidden'); authBtn.innerText = "Register";
//         authToggleText.innerText = "Already registered?"; authToggleBtn.innerText = "Log In Here";
//     }
// }

// authBtn.addEventListener('click', async () => {
//     const mobile = authMobile.value.trim(); const password = authPassword.value.trim(); const name = authName.value.trim();
//     if (!mobile || !password || (!isLoginView && !name)) return alert("Fields are mandatory!");

//     try {
//         const endpoint = isLoginView ? '/api/login' : '/api/register';
//         const res = await fetch(`${API_BASE}${endpoint}`, {
//             method: 'POST', headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(isLoginView ? { mobile, password } : { name, mobile, password })
//         });
//         const data = await res.json();
//         if (data.success) {
//             if (isLoginView) {
//                 currentUser = data.user; localStorage.setItem('whatsapp_user', JSON.stringify(currentUser));
//                 initApplication();
//             } else { alert("Registered! Login now."); isLoginView = true; toggleAuthView(true); }
//         } else { alert(data.msg); }
//     } catch (err) { alert("Server failure!"); }
// });

// logoutBtn.addEventListener('click', () => { localStorage.removeItem('whatsapp_user'); window.location.reload(); });

// function initApplication() {
//     authContainer.classList.add('hidden'); appContainer.classList.remove('hidden');
//     userDisplayName.innerText = currentUser.name; userAvatar.innerText = currentUser.name.charAt(0);
    
//     // Explicit room attachment immediately at system initialization
//     socket.emit('join', String(currentUser.mobile).trim());
    
//     loadMyContacts();
//     initMessagingEngine();
// }

// addContactBtn.addEventListener('click', async () => {
//     const targetMobile = contactMobileInput.value.trim();
//     if (!targetMobile) return;
//     try {
//         const res = await fetch(`${API_BASE}/api/add-contact`, {
//             method: 'POST', headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ userMobile: currentUser.mobile, contactMobile: targetMobile })
//         });
//         const data = await res.json(); alert(data.msg);
//         if (data.success) { contactMobileInput.value = ""; loadMyContacts(); }
//     } catch (err) {}
// });

// async function loadMyContacts() {
//     try {
//         const res = await fetch(`${API_BASE}/api/contacts/${currentUser.mobile}`);
//         const contacts = await res.json();

//         let activeSelection = activeChatPartner ? activeChatPartner.mobile : null;
//         usersList.innerHTML = "";
//         if (contacts.length === 0) {
//             usersList.innerHTML = `<div class="p-4 text-sm text-gray-500 text-center">No active chats.</div>`; return;
//         }
//         contacts.forEach(user => {
//             const item = document.createElement('div');
//             const isActive = activeSelection === user.mobile ? 'bg-[#2a3942]' : '';
//             item.className = `flex items-center px-4 py-3 hover:bg-[#202c33] cursor-pointer transition select-none border-b border-[#222e35]/40 ${isActive}`;
//             item.setAttribute('data-mobile', user.mobile);
//             item.innerHTML = `
//             <div class="w-11 h-11 bg-emerald-700 text-white flex items-center justify-center rounded-full font-bold uppercase shrink-0">${user.name.charAt(0)}</div>
//             <div class="flex-1 ml-3 overflow-hidden">
//                 <h4 class="text-gray-200 text-sm font-medium truncate">${user.name}</h4>
//                 <p class="text-xs text-gray-400 truncate mt-0.5">${user.mobile}</p>
//             </div>`;
//             item.addEventListener('click', () => switchActiveChat(user));
//             usersList.appendChild(item);
//         });
//     } catch (err) {}
// }

// async function switchActiveChat(targetUser) {
//     activeChatPartner = targetUser; chatWelcome.classList.add('hidden');
//     activeChatName.innerText = targetUser.name; activeChatAvatar.innerText = targetUser.name.charAt(0);

//     document.querySelectorAll('#users-list > div').forEach(node => {
//         if(node.getAttribute('data-mobile') === targetUser.mobile) node.classList.add('bg-[#2a3942]');
//         else node.classList.remove('bg-[#2a3942]');
//     });

//     if (window.innerWidth < 768) {
//         sidebarPanel.classList.add('hidden'); chatPanel.classList.replace('hidden', 'flex');
//     }

//     // Refresh display view safely without resetting trackers incorrectly
//     chatMessagesBox.innerHTML = "";
//     RENDERING_TRACKER_IDS.clear();

//     await loadChatHistory();
    
//     const inp = document.getElementById('chat-input'); 
//     if (inp) inp.focus();
// }

// mobileBackBtn.addEventListener('click', () => {
//     activeChatPartner = null; chatPanel.classList.replace('flex', 'hidden'); sidebarPanel.classList.remove('hidden');
// });
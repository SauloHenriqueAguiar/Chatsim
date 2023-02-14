const socket = io();

let username = '';
let userList = [];

let loguinPage = document.querySelector('#loguinPage');
let chatPage = document.querySelector('#chatPage');

let loguinInput = document.querySelector('#loguinnameInput');
let textInput = document.querySelector('#chatTextInput');

loguinPage.style.display = 'flex';
chatPage.style.display = 'none';

function renderUserList() {
    let ul = document.querySelector('.userList');
    ul.innerHTML = '';

    userList.forEach(i =>
        ul.innerHTML += '<li>' + i + '</li>')

};


function addMessage(type, user, msg) {
    let ul = document.querySelector('.chatList');

    switch (type) {
        case 'status':
            ul.innerHTML += '<li class="m-status">' + msg + '</li>';
            break;
        case 'msg':
            if(username == user){
                ul.innerHTML += '<li class="m-txt" ><span class="me"> ' + user + ' </span> ' + msg + ' </li>'

            }else {
                ul.innerHTML += '<li class="m-txt"><span> ' + user + ' </span> ' + msg + ' </li>'

            }
    }
     ul.scrollTop = ul.scrollHeight;
}


loguinInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        let name = loguinInput.value.trim();
        if (name != '') {
            username = name;
            document.title = 'Chat (' + username + ')';

            socket.emit('join-request', username);



        }
    }
});


textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        let txt = textInput.value.trim();
        textInput.value = ' ';

       if(txt != ' '){
           addMessage('msg',username,txt)
           socket.emit('send-msg',  txt)

       } 

    }
    
    
    
});


socket.on('user-ok', (list) => {
    loguinPage.style.display = 'none';
    chatPage.style.display = 'flex';
    textInput.focus();

    addMessage('status', null, 'Conectado!');
    userList = list;
    renderUserList();
}
);

socket.on('list-update', (data) => {
    if (data.joined) {
        addMessage('status', null, data.joined + ' entrou no chat');


    }
    if (data.left) {
        addMessage('status', null, data.left + ' saiu do chat')
    }

    userList = data.list;
    renderUserList();
});

socket.on('show-msg',(data)=>{
   addMessage('msg',data.username,data.message);
});

socket.on('disconnect', ()=> {
    addMessage('status', null,'voce saiu!');
});

socket.on('reconnect_error',()=>{
    addMessage('status',null,'tentando reconectar...');
});

socket.on('reconnect', () => {
    addMessage('status',null,'Reconectado!')

if(username != ''){
    socket.emit('join-request',username);

} 
});
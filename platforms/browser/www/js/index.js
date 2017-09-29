document.addEventListener("deviceready", onDeviceReady, false);

var accessKey = ''
var windowstatus = 0
var sessionID = ''
var condName = ''
var unityName = ''
var userName = ''

function onDeviceReady() {
    accessKey = window.localStorage.getItem('procontrolok')
    if (accessKey == "1") {
        sessionID = window.localStorage.getItem('sessionID')
        if (sessionID.length == 128) {
            verifySessionId(sessionID)
        } else {
            drawScreen()
        }
    } else {
        drawScreen()
    }
}

/*
    0 - Login         1 - Main          2 - Noticias
    3 - Mensagens     4 - Cadastro      5 - Reservas
*/

function drawScreen() {
    if (windowstatus == 0) {
        drawLoginScreen()
    } else {
        if (windowstatus == 1) {
            drawMainScreen()
        } else {
            if (windowstatus == 2) {
                drawNewsScreen()
            } else {
                if (windowstatus == 3) {
                    drawMsgScreen()
                } else {
                    if (windowstatus == 4) {
                        drawCadScreen()
                    } else {
                        if (windowstatus == 5) {
                            drawResScreen()
                        } else {
                            drawErrorScreen('Problema nos dados, reiniciar aplicativo', 0)
                        }
                    }
                }
            }
        }
    }
}


function drawErrorScreen(msg, sta) {
    windowstatus = sta
    var drw = document.getElementById('mainwrapp')
    drw.innerHTML = m + '<br/><br/><input type="button" class="button1" value="" onclick="drawScreen()" />'
}

/* LOGIN */
function drawLoginScreen() {
    var tit = document.getElementById('title')
    tit.className = "logintitle"
    tit.innerHTML = '<img src="img/mainlogo.png" alt="Procontrol" width="100%" />'
    var drw = document.getElementById('mainwrapp')
    drw.innerHTML = '<form class="flogin" name="flogin" ><input type="text" name="login" placeholder="Usuário" style="margin-top: 80px"/><br/><input type="password" name="pass" placeholder="Senha"/><br/><br><input class="button1" type="button" value="ENTRAR" onclick="doLogin()"/></form>'
}

function doLogin() {
    var l = document.flogin.login.value.trim()
    var p = document.flogin.pass.value.trim()
    if (l != '' && p != '') {
        JSONRequest('api_auth.cgi', { "request": { "user": l, "pass": p, "unique_id": device.uuid } },
            function(J) {
                if (J.access == 'ok') {
                    window.localStorage.setItem('procontrolok', "1")
                    window.localStorage.setItem('sessionID', J.session_id)
                    window.localStorage.setItem('condName', J.cond_name)
                    window.localStorage.setItem('unityName', J.unity_name)
                    window.localStorage.setItem('userName', J.user_name)
                    sessionID = J.session_id
                    condName = J.cond_name
                    unityName = J.unity_name
                    userName = J.user_name
                    windowstatus = 1
                    drawScreen()
                } else {
                    alert(J.message)
                }
            },
            function(e) { drawErrorScreen('Para que o Procontrol funcione corretamente, o seu dispositivo deve estar conectado à Internet.<br/>Por favor verifique a conexão.<br/>Erro:' + e, 0) })
    } else {
        alert("Preencha usuário e senha")
    }
}

function verifySessionId(sID) {

    JSONRequest('api_verify.cgi', { "request": { "session_id": sID, "unique_id": device.uuid } },
        function(J) {
            if (J.access == 'ok') {
                window.localStorage.setItem('procontrolok', "1")
                window.localStorage.setItem('sessionID', J.session_id)
                window.localStorage.setItem('condName', J.cond_name)
                window.localStorage.setItem('unityName', J.unity_name)
                window.localStorage.setItem('userName', J.user_name)
                sessionID = J.session_id
                condName = J.cond_name
                unityName = J.unity_name
                userName = J.user_name
                windowstatus = 1
                drawScreen()
            } else {
                alert(J.message)
                drawScreen()
            }
        },
        function(e) { drawErrorScreen('Para que o Procontrol funcione corretamente, o seu dispositivo deve estar conectado à Internet.<br/>Por favor verifique a conexão.<br/>Erro:' + e, 0) })
}
/* Main */
function drawMainScreen() {
    drawMenu()
    var drw = document.getElementById('mainwrapp')
    drw.innerHTML = '<div class="content" style="margin-top: 50px">Condominio ' + condName + '<br/>Unidade: ' + unityName + '<br/>' + userName + '</div>'
}

function clearAccess() {
    if (confirm("Deseja desconectar do Procontrol ?")) {
        window.localStorage.clear();
        windowstatus = 0;
        drawScreen();
    }
}

function drawNewsScreen() {
    drawMenu()
    var drw = document.getElementById('mainwrapp')
    JSONRequest('api_news.cgi', { "request": { "session_id": sessionID, "unique_id": device.uuid, "operation": "getnews" } },
        function(J) {
            if (J.access == 'ok') {
                if (J.news.length == 0) {
                    drw.innerHTML = '<div class="newstitle">Notícias</div><br>Não existem Notícias'
                } else {
                    drw.innerHTML = '<div class="newstitle">Notícias<br/><br>'
                    for (var c = 0; c < J.news.length; c++) {
                        drw.innerHTML += '<div class="newsbox"><b>Data</b>: ' + J.news[c].d + '<br/><b>Assunto:</b>' + J.news[c].s + '<br/>' + J.news[c].b + '</div>'
                    }
                }
            } else {
                alert(J.message)
                windowstatus = 0;
                drawScreen()
            }
        },
        function(e) { drawErrorScreen('Para que o Procontrol funcione corretamente, o seu dispositivo deve estar conectado à Internet.<br/>Por favor verifique a conexão.<br/>Erro:' + e, 0) })


}

function drawMsgScreen() {
    drawMenu()
    var drw = document.getElementById('mainwrapp')
    drw.innerHTML = 'Mensagens'
}

function drawCadScreen() {
    drawMenu()
    var drw = document.getElementById('mainwrapp')
    drw.innerHTML = 'Cadastro'
}

function drawResScreen() {
    drawMenu()
    var drw = document.getElementById('mainwrapp')
    drw.innerHTML = 'Reservas'
}

/* 
    Support 
*/
function drawMenu() {
    var tit = document.getElementById('title')
    tit.className = "contenttitle"
    tit.innerHTML = '<img src="img/hb.png" alt="menu" style="margin:2px" onclick="toogleSidenav()"/><div class="top1"><img src="img/procontrol.png" alt="Logo" /></div>'
}

function toogleSidenav() {
    if (document.getElementById('sidenavID').style.display == "block") {
        document.getElementById('sidenavID').style.display = "none"
        document.getElementById('sidenavID').style.width = '0'
    } else {
        document.getElementById('sidenavID').style.display = "block"
        document.getElementById('sidenavID').style.width = "12em"
    }
}

function menuClick(sta) {
    toogleSidenav()
    windowstatus = sta
    drawScreen()
}

function JSONRequest(remoteFile, JSONData, retOkFunction, retErrFunction) {
    var xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://secure.youlink.com.br/cgi-bin/app/' + remoteFile)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status === 200) {
                retOkFunction(JSON.parse(xhr.responseText))
            } else {
                retErrFunction(xhr.status)

            }
        }
    };
    xhr.send(JSON.stringify(JSONData));
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
document.addEventListener("deviceready", onDeviceReady, false);

var accesskey = ''
var windowstatus = 0

function onDeviceReady() {
    accesskey = window.localStorage.getItem('ok')
    if (accesskey == "1") {
        windowstatus = 1
    }
    drawScreen()
}

/*
    0 - Login
    1 - Main
    2 - Noticias
    3 - Mensagens
    4 - Cadastro
    5 - Reservas
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
                    if (windowstatus == 2) {
                        drawCadScreen()
                    } else {
                        if (windowstatus == 2) {
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

function drawLoginScreen() {
    var drw = document.getElementById('mainwrapp')
    drw.innerHTML = 'Login'
}

function drawNewsScreen() {
    var drw = document.getElementById('mainwrapp')
    drw.innerHTML = 'News'
}

function drawMsgScreen() {
    var drw = document.getElementById('mainwrapp')
    drw.innerHTML = 'Mensagens'
}

function drawCadScreen() {
    var drw = document.getElementById('mainwrapp')
    drw.innerHTML = 'Cadastro'
}

function drawResScreen() {
    var drw = document.getElementById('mainwrapp')
    drw.innerHTML = 'Reservas'
}
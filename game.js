const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')


const drawRect = (x, y, w, h, color) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
}

const drawCircleS = (x, y, r, w, color) => {
    ctx.strokeStyle = color
    ctx.lineWidth = w
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.stroke()
}
const drawCircleF = (x, y, r, color) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
}

const drawText = (text, x, y, color) => {
    ctx.fillStyle = color
    ctx.font = '40px arial'
    ctx.fillText(text, x, y)
}

var drawball = () => {
    drawCircleF(ball.x, ball.y, ball.r, ball.color)
    drawCircleS(ball.x, ball.y, ball.r + 1, 2, '#fff')
}

var drawMap = () => {
    //saha
    drawRect(0, 0, 800, 400, '#2e7d32')
    //orta çizgi
    drawRect(397, 0, 6, 400, '#fff')
    //ortadaki çember
    drawCircleS(400, 200, 75, 5, '#fff')
    //ortadaki daire
    drawCircleF(400, 200, 10, '#fff')
}

var user = {
    x: 20,
    y: canvas.height / 2 - 50,
    w: 10,
    h: 100,
    color: '#fff',
    score: 0,
    isMovingUp: false,
    isMovingDown: false
}

var user2 = {
    x: canvas.width - 30,
    y: canvas.height / 2 - 50,
    w: 10,
    h: 100,
    color: '#fff',
    score: 0,
    isMovingUp: false,
    isMovingDown: false
}

var ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: 10,
    color: '#b71c1c',
    speed: 0,
    maxSpeed: 7,
    velocityX: 0,
    velocityY: 0,
    stop: true
}

gameIsEnded = false

var Button = {
    x: canvas.width / 2 - 130,
    y: canvas.height  - 160,
    width: 260,
    height: 90,
    text: "Yeniden Oyna",
    font: "8px Arial",
    backgroundColor: '#722f37',
    color: '#fff'
    
}


//hareket---------------------------------------------------------------------
const userMouseMove = (e) => {

    let rect = canvas.getBoundingClientRect()
    user.y = e.clientY - rect.top - user.h / 2

    ball.stop=false
}
//canvas.addEventListener('mousemove', userMouseMove)

function userKeyDown(e){

    ball.stop = false


    if(e.code === 'KeyW'){
        user.isMovingDown = true;
    }

    if(e.code === 'KeyS'){
        user.isMovingUp = true;
    }

    if(e.keyCode == 80){
        user2.isMovingDown = true;
    }

    if(e.keyCode == 186){
        user2.isMovingUp = true;
    }
}

document.addEventListener('keydown', userKeyDown)

function userKeyUp(e){
    if(e.code === 'KeyW'){
        user.isMovingDown = false;
    }

    if(e.code === 'KeyS'){
        user.isMovingUp = false;
    }

    if(e.keyCode == 80){
        user2.isMovingDown = false;
    }

    if(e.keyCode == 186){
        user2.isMovingUp = false;
    }
}

document.addEventListener('keyup', userKeyUp);

function onClick(e){
    if(!gameIsEnded)
        return

    var mousePosition = getMousePos(canvas, e)

    if(isInside(mousePosition, Button)){
        restartLevel()
    }
        

}

canvas.addEventListener('click', onClick)

//******************** GET MOUSE POSITION **************/
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}
//-----------------------------------------------------------------------------


//colision---------------------------------------------------------------------
const collision = (b, h) => {
    b.top = b.y - b.r
    b.bottom = b.y + b.r
    b.left = b.x - b.r
    b.right = b.x + b.r

    h.top = h.y
    h.bottom = h.y + h.h
    h.left = h.x
    h.right = h.x + h.w

    return (b.top < h.bottom && b.bottom > h.top && b.left < h.right && b.right > h.left)
}

//topun pozisyonunu sıfırlamak
const resetBall = () => {

    ball.x = canvas.width / 2
    ball.y = canvas.height / 2

    ball.speed = 5
    ball.velocityX = ((Math.random() > 0.5)?1:-1) * 3;
    ball.velocityY = ((Math.random() > 0.5)?1:-1) * 4;
    ball.stop = true
}

const restartLevel = () =>{
    user.score = 0
    user2.score = 0

    gameIsEnded = false

    user.y = canvas.height / 2 - 50
    user2.y = canvas.height / 2 - 50
}



const update = () => {

    if (ball.stop)
        return
    
    ball.x += ball.velocityX
    ball.y += ball.velocityY



    if (ball.y + ball.r > canvas.height) {

        ball.velocityY = -Math.abs(ball.velocityY)

    }else if(ball.y - ball.r < 0){
        ball.velocityY = Math.abs(ball.velocityY)
    }


    let half = (ball.x < canvas.width / 2) ? user : user2

    if (collision(ball, half)) {
        let intersectY = ball.y - (half.y + half.h / 2)
        intersectY /= half.h / 2

        let maxBounceRate = Math.PI / 3
        let bounceAngle = intersectY * maxBounceRate

        let direction = (ball.x < canvas.width / 2) ? 1 : -1

        ball.velocityX = direction * ball.speed * Math.cos(bounceAngle)
        ball.velocityY = ball.speed * Math.sin(bounceAngle)
        
        //ADD SPEED TO BALL

        if(ball.speed <= ball.maxSpeed)
            ball.speed+= 0.2
    }

    //*************************** USERS MOVE ***************/

    if(user.isMovingUp && user.y + user.h < canvas.height){
        user.y += 0.8 * ball.speed;
    }
    if(user.isMovingDown && user.y > 0){
        user.y -= 0.8 * ball.speed;
    }

    if(user2.isMovingUp && user2.y + user2.h < canvas.height){
        user2.y += 0.8 * ball.speed;
    }
    if(user2.isMovingDown && user2.y > 0){
        user2.y -= 0.8 * ball.speed;
    }

    /***************************** IF USERS GET SCORE **********/

    if (ball.x > canvas.width) {
        user.score++
        resetBall()

        if(user.score >= 1){
            finishGame("OYUNCU 1")
        }

    } else if (ball.x < 0) {
        user2.score++
        resetBall()

        if(user2.score >= 1){
            finishGame("OYUNCU 2")
        }
    }
}

function finishGame(value){
    gameIsEnded = true

    //drawRect(0, 0, 800, 400, '#000')
    drawMap()

    drawText(value + " KAZANDI!", canvas.width / 4, 100, '#000')

    drawRect(Button.x, Button.y, Button.width, Button.height, Button.backgroundColor)
    drawText(Button.text, Button.x + 5, Button.y + 14 + Button.height / 2, Button.color)
    
}

const render = () => {

    //************* DRAW MAP *************/
    drawMap()

    //kullanıcı 1 skor
    drawText(user.score, canvas.width / 4, 100, '#fff')
    //kullancı 2 skor
    drawText(user2.score, 3 * canvas.width / 4, 100, '#fff')

    //kullnaıcı 1in raketi
    drawRect(user.x, user.y, user.w, user.h, '#fff')
    //kullanıcı 2 nin raketi
    drawRect(user2.x, user2.y, user2.w, user2.h, '#fff')

    //topu çizdirme
    drawball()

}

//oyun
const game = () => {

    if(gameIsEnded)
        return

    render()
    update()

}

//RESET THE BALL
resetBall()

//oyunun kaç fps çalıaşcağı
const fps = 120
setInterval(game, 1000 / fps)
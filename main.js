// Copyright (c) 2019-2022 Ivan Teplov
(function() {
    const canvas = document.querySelector('#canvas')
    const context = canvas.getContext('2d')

    const ball = {
        x: 0,
        y: 0,
        speed: {
            x: -5,
            y: 2
        }
    }

    const firstPlayer = {
        y: 0,
        score: 0
    }

    const secondPlayer = {
        y: 0,
        score: 0
    }
    
    let showingWinScreen = false

    const playerHeight = 100
    const playerWidth = 10
    const winningScore = 3
    const framesPerSecond = 50

    window.addEventListener('load', function() {
        resetBall()
        
        firstPlayer.y = canvas.height / 2
        secondPlayer.y = canvas.height / 2

        setInterval(function() {
            moveEverything()
            drawEverything()
        }, 1000 / framesPerSecond)

        canvas.onmousemove = function(event) {
            firstPlayer.y = event.clientY - canvas.getBoundingClientRect().top
                - window.scrollY - playerHeight / 2
        }

        canvas.onclick = function() {
            if (showingWinScreen) {
                firstPlayer.score = 0
                secondPlayer.score = 0
                showingWinScreen = false
            }
        }
    })

    function drawNet() {
        for (let i = 0; i < canvas.height; i+= 40) {
            colorRect(canvas.width / 2 - 1, i, 2, 20, 'white')
        }
    }

    function resetBall() {
        if (firstPlayer.score >= winningScore || secondPlayer.score >= winningScore) {
            ball.x = canvas.width / 2
            ball.y = canvas.height / 2 + 50
            ball.speed.x *= -1
            ball.speed.y *= 0.3
            showingWinScreen = true
            return
        }

        ball.x = canvas.width / 2
        ball.y = canvas.height / 2
        ball.speed.x *= -1
        ball.speed.y *= 0.3
    }

    function moveEverything() {
        if (showingWinScreen) return

        ball.x += ball.speed.x
        ball.y += ball.speed.y

        if (ball.x < 0) {
            if (ball.y > firstPlayer.y && ball.y < firstPlayer.y + playerHeight) {
                ball.speed.x *= -1
                
                var deltaY = ball.y - (firstPlayer.y + playerHeight / 2)
                ball.speed.y = deltaY * 0.25
            } else {
                secondPlayer.score++
                resetBall()
            }
        }

        if (ball.x > canvas.width) {
            if (ball.y > secondPlayer.y && ball.y < secondPlayer.y + playerHeight) {
                ball.speed.x *= -1

                var deltaY = ball.y - (secondPlayer.y + playerHeight / 2)
                ball.speed.y = deltaY * 0.25
            } else {
                firstPlayer.score++
                resetBall()
            }
        }

        if (ball.y < 0 || ball.y > canvas.height) {
            ball.speed.y *= -1
        }

        if (ball.speed.x > 0 && Math.abs(secondPlayer.y + playerHeight / 2 - ball.y) > 30) {
            if (secondPlayer.y + playerHeight / 2 < ball.y) {
                secondPlayer.y += 4
            } else {
                secondPlayer.y -= 4
            }
        }
    }

    function drawEverything() {
        colorRect(0, 0, canvas.width, canvas.height, '#000')
        colorArc(ball.x, ball.y, 10, '#fff')
        colorRect(0, firstPlayer.y, playerWidth, playerHeight, '#fff')
        colorRect(canvas.width - playerWidth, secondPlayer.y, playerWidth, playerHeight, '#fff')
        
        drawNet()

        ctx.font = "12pt Arial"
        ctx.fillStyle = '#fff'
        ctx.fillText(firstPlayer.score, canvas.width / 3, 50)
        ctx.fillText(secondPlayer.score, canvas.width / 3 * 2, 50)
        if (showingWinScreen) {
            ctx.textAlign = "center"
            ctx.fillText("Нажмите, чтобы продолжить", canvas.width / 2, canvas.height - 100)
            if (firstPlayer.score > secondPlayer.score) {
                ctx.fillText("Вы победили!", canvas.width / 2, canvas.height /2)
            } else if (secondPlayer.score > firstPlayer.score) {
                ctx.fillText("Вы проиграли!", canvas.width / 2, canvas.height /2)
            } else {
                ctx.fillText("Ничья!", canvas.width / 2, canvas.height /2)
            }
        }
    }

    function colorArc(x, y, r, color) {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.fill()
    }

    function colorRect(x, y, w, h, color) {
        ctx.fillStyle = color
        ctx.fillRect(x, y, w, h)
    }
})()


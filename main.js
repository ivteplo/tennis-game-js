(function() {
    var canvas, ctx, 
    ballX, ballY, 
    ballSpeedX = -5, ballSpeedY = 2, 
    player1Y, player2Y, 
    player1Score = 0, player2Score = 0;

    var showingWinScreen = false;
    const PLAYER_HEIGHT = 100, PLAYER_WIDTH = 10;
    const WINNING_SCORE = 3;

    window.onload = function() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext("2d");
        
        resetBall();
        
        player1Y = canvas.height / 2;
        player2Y = canvas.height / 2;

        var framesPerSecond = 50;

        setInterval(function() {
            moveEverything();
            drawEverything();
        }, 1000 / framesPerSecond);

        canvas.onmousemove = function(event) {
            player1Y = event.clientY - canvas.getBoundingClientRect().top 
                        - window.scrollY - PLAYER_HEIGHT / 2;
        };

        canvas.onclick = function() {
            if (showingWinScreen) {
                player1Score = 0;
                player2Score = 0;
                showingWinScreen = false;
            }
        };
    };

    function drawNet() {
        for (var i = 0; i < canvas.height; i+= 40) {
            colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
        }
    }

    function resetBall() {
        if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2 + 50;
            ballSpeedX *= -1;
            ballSpeedY *= 0.3;
            showingWinScreen = true;
            return;
        }
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX *= -1;
        ballSpeedY *= 0.3;
    }

    function moveEverything() {
        if (showingWinScreen) return;
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballX < 0) {
            if (ballY > player1Y && ballY < player1Y + PLAYER_HEIGHT) {
                ballSpeedX *= -1;
                
                var deltaY = ballY - (player1Y + PLAYER_HEIGHT / 2);
                ballSpeedY = deltaY * 0.25;
            } else {
                player2Score++;
                resetBall();
            }
        }
        if (ballX > canvas.width) {
            if (ballY > player2Y && ballY < player2Y + PLAYER_HEIGHT) {
                ballSpeedX *= -1;

                var deltaY = ballY - (player2Y + PLAYER_HEIGHT / 2);
                ballSpeedY = deltaY * 0.25;
            } else {
                player1Score++;
                resetBall();
            }
        }
        if (ballY < 0 || ballY > canvas.height) {
            ballSpeedY *= -1;
        }

        if (ballSpeedX > 0) {
            if (Math.abs(player2Y + PLAYER_HEIGHT / 2 - ballY) > 30) {
                if (player2Y + PLAYER_HEIGHT / 2 < ballY) {
                    player2Y += 4;
                } else {
                    player2Y -= 4;
                }
            }
        }
    }

    function drawEverything() {
        colorRect(0, 0, canvas.width, canvas.height, '#000');
        colorArc(ballX, ballY, 10, '#fff');
        colorRect(0, player1Y, PLAYER_WIDTH, PLAYER_HEIGHT, '#fff');
        colorRect(canvas.width - PLAYER_WIDTH, player2Y, PLAYER_WIDTH, PLAYER_HEIGHT, '#fff');
        
        drawNet();

        ctx.font = "12pt Arial";
        ctx.fillStyle = '#fff';
        ctx.fillText(player1Score, canvas.width / 3, 50);
        ctx.fillText(player2Score, canvas.width / 3 * 2, 50);
        if (showingWinScreen) {
            ctx.textAlign = "center";
            ctx.fillText("Нажмите, чтобы продолжить", canvas.width / 2, canvas.height - 100);
            if (player1Score > player2Score) {
                ctx.fillText("Вы победили!", canvas.width / 2, canvas.height /2);
            } else if (player2Score > player1Score) {
                ctx.fillText("Вы проиграли!", canvas.width / 2, canvas.height /2);
            } else {
                ctx.fillText("Ничья!", canvas.width / 2, canvas.height /2);
            }
        }
    }

    function colorArc(x, y, r, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    function colorRect(x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }
})();

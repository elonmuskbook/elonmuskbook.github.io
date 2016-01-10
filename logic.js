function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

rotateAndCache = function(image,angle) {
  var offscreenCanvas = document.createElement('canvas');
  var offscreenCtx = offscreenCanvas.getContext('2d');

  var size = Math.max(image.width, image.height);
  offscreenCanvas.width = size;
  offscreenCanvas.height = size;

  offscreenCtx.translate(size/2, size/2);
  offscreenCtx.rotate(angle + Math.PI/2);
  offscreenCtx.drawImage(image, -(image.width/2), -(image.height/2));

  return offscreenCanvas;
}

// Global variables
var planets = [];
var scores = [];
var nShots = 5;
var nPlayers = 2;
var PLAYER_HIDER = 0;
var PLAYER_SEEKER = 1;
var HUMAN = 0;
var CPU = 1;
var PLAYER_HIDER_STATE = -1;
var PLAYER_SEEKER_STATE = -1;
var cpuPlayers = [];
var hiderCanPickScore = true;
var currentPlayer = 0;
var speed = 20;
var epsilon = 1e-12;
var missileTimeSteps = 0;
var missileX=-1, missileY=-1, missiledX, missiledY;
var missileUpdateID;
var currentScore = Infinity;
var bestSeekerScore = Infinity;
var hiderScore = Infinity;
var PLANET_MASS = 100;
var nPlanets = 3;
var planetsMass = [];
for(var i=0;i<nPlanets;i++){
    planetsMass[i] = PLANET_MASS;
}
var superBlackHoleIndex = 2; // this is the expanding black hole

var mousePosition = document.getElementById('mousePosition');
var message = document.getElementById('message');
var resetButton = document.getElementById('reset');
var scoreButton = document.getElementById('score');
var play2HumansButton = document.getElementById('play_2_humans');
var chooseGameModeButton = document.getElementById('')
var play1HumanAsHiderButton = document.getElementById('play_1_human_as_hider');
var play1HumanAsSeekerButton = document.getElementById('play_1_human_as_seeker');
var scoreBox = document.getElementById('scores');
var canvas = document.getElementById('canvas');
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var startWidth = canvas.width / 5;
var endWidth = canvas.width / 7;
var ctx = canvas.getContext('2d');

var targetMarginWidth=20;
var targetMarginHeight=30;
var target = [canvasWidth+getRandomInt(-endWidth+targetMarginWidth, -targetMarginWidth), getRandomInt(targetMarginHeight, canvasHeight-targetMarginHeight)]

var scores = [];
var boardControl = [];

var missileImg = new Image();
missileImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwLAigmsZmRYwAAA/hJREFUOMu9lVtsVFUUhv99mfvpdHqbttObnZ7SUkhLicQLiQlgTLDUEkn0wVtICAYCsWp9KcVGWhsTCIkJUUFI9IEXQ2IIloCKQqdIQ6EjKLWEM1Onzq3TWlqnc+mcnrN9aKwhNMVLdL2uvf+9sva/vgX8B0GWS3bIbqQ0DWZKHRpAmCCUUoguxT+13D26XLJb8SOLc7eN8bsF3Dgl2dkHQqDwQZXSBx0QwFMrrFY02iTUui3PeX2JWEeV+9+JLigLCAI4Jgx4ZmvOwW6f/++JdldXbe+srXpyselCwCwEjEIHj+so0/hLXYBhKbGmlh0AAH7/K3Tbo5VS0+GS6uffuHDns0hBpf1MUQVyJAlU0wCriad2NYf2mCW/q8hJo5FxoyMni/v8wY9OfnrwyOLvt7d/Z+jpeVwFgD2V5bYGs22mrMzErszh1aG8R46Wl1ciz5GL+oFeKBuehbO4ABcvXU7PzMx8HomE3w0Fo3MuV07Y6SxO9p4+DtLWeYUzTlZmbKzfEFdl78ip+EMW/r4A20k4kBEMBAAhHEIwMKqCUApN00Q6nToyl0716UKcAQjv93iSk9GbgqtWNr16jWS57kvSX9VIcFtmmtkKDSyvIRvz3IVQqhQ3r0Xx9NY1SKUysFrN8P0chtAFEULspYTsBaAJXWBlrTx67ap3M3XmmGyMCHrghRoYdc1Y09bKhh2r4Y3VYWjMjPNnr+K1N7dApRIUxQdF8WPDE41Yu24VeHEFVFMuBsYYy6+oZtGJfHnX7ldGSPeH30fsDlKUVHUowUC6ZPhbc3FFNpw1+dBpNqJxM2KRJBofdiM9l4HFbEY4MgldF1AzGigFwsEJqKoOgzHTd2t4pJUAwO7XPRvtjdIhi2Ld8sm5VrV5hfyxgVtbYNNxV7PBZDCCMAZBGajQYTIaEE8k5pOz8WOzs/Fh5fatU0azmXsHz4cWfZptZRffe7lxbeeBmvCm2I+p+utftzSFzsHxw9m3JmIRmCwWFDkc2KgMoqy0BA31dRDafNrAWcwu2S49tn69XZZrkn/YkgFAv+eEWDRwfsHJelmqG0zEX9znuX10k12KxKmhOZNKYVTKw8xkFOFoJG612VJyVek6zvl2t7t85+Rk3HDD6/lmafMTHBsY/a3n7Z98XgAonArSVelp5HIOCCDuUnH4i1jRmFyVCoxFUFhYgGh4HKWl2aKpZQd6Tx+/V3S/7MY7d3xfAUB7hRs9AT8EAE4WCMmzgBCZO9GHaBJKFAAQ/WWBA8EAEAzcuH/2u5Q/QdET8N/DByqAqVwVQ18m9oUOLU8p/hcoftmfTs5bCSOJoHbBVWp0lbT5x//xWuiQl65ov+zG/x6/A/JUmSE13qh6AAAAAElFTkSuQmCC";
var targetImg = new Image();
targetImg.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCAAUABUDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABwb/xAAbAQAABwEAAAAAAAAAAAAAAAAAAQIDBAUGB//aAAwDAQACEAMQAAABCHoq/eECZ52wmwGDVgO5+qKfs6RZTSD/AP/EAB0QAAEEAgMAAAAAAAAAAAAAAAUAAQQGAgMUFRb/2gAIAQEAAQUCr9eyMKUCAatZYf1k6pkeOw0PJkq3ysZJpndn9IUyiL//xAAgEQACAQMEAwAAAAAAAAAAAAABAwIAERIEEBMxBSFh/9oACAEDAQE/AXu4gLD2ak7AXIpTA2GQrWcsZwmsfDTEB0cZdV49E0KtPsna23//xAAgEQACAQIHAQAAAAAAAAAAAAABAgMAEQQFECExUXHw/9oACAECAQE/AYArShSCfKfKw0Zlgubfbd0VZdmFvawcrxzoqKDc2N6x7wSxtDOxt1xUSlRvoXZuTp//xAAmEAACAQIFAgcAAAAAAAAAAAABAwIABBESExQhMVEFEDJBQkOB/9oACAEBAAY/AmOnMKtlECUj1JPsKNrdeHbd2QGLrZs8wPaQkTTEBgbEcxYPkKenWKpS5iY8UuabdTIy+4sxA/MeKYAYS0hp5l+kkdqxHBra79+gesRLr5f/xAAcEAEAAgIDAQAAAAAAAAAAAAABABEhMUFRYYH/2gAIAQEAAT8hNs2KdMQZcRULWR7gwduTqYAG5V01w9ndzCrLiy6S/YhfgKGdoD9EGEm1LBvDCZr5BSIaSKSAkVKVpdp5Gf/aAAwDAQACAAMAAAAQY40WH//EAB4RAQABBAMBAQAAAAAAAAAAAAERACExQRBRcWGB/9oACAEDAQE/EIJJgKdJCEwZ8vQoknTZKASb3ND91SsrumkZwhjosGPJ/eAGDj//xAAeEQEBAAICAwEBAAAAAAAAAAABEQBBITFRcZEQYf/aAAgBAgEBPxCi91AvteA8ujEQBNGcwvKhoHV59YzW/Aj8yZnoNfx1O91nGFncGSmasRN96Ljs8n5rBRpnfb7X8//EABsQAQEAAwEBAQAAAAAAAAAAAAERACExUWFB/9oACAEBAAE/ED0fJYLQpWuznwsR/jAOjGwkEHRwpr4IArU6NUYBXuePsbN4TQhKfvu9hcwCI7UhGj1CYlYDVzaEDJO7buM3cVxH0fcGMAVSEUQEUp8zRTzP/9k=";
var blackHoleImg = new Image();
blackHoleImg.src = "data:image/png;base64,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";

var nStars = 100;
var stars = [];
for(var i=0;i<nStars;i++){
    stars.push([getRandomInt(0, canvasWidth), getRandomInt(0, canvasHeight)]);
}
/*
game states:
PUT_PLANETS: PLAYER_HIDER places 2 planets on board
CHOOSE_START: choose starting point of missile
CHOOSE_DIRECTION: choose direction of missile
CHOOSE_SHOT:
*/
var PUT_PLANETS = 0;
var CHOOSE_START = 1;
var CHOOSE_DIRECTION = 2;
var CHOOSE_SHOT = 3;
var gameState = -1;

var MODE_TWO_HUMAN_PLAYERS = 0;
var MODE_HUMAN_SEEKER = 1;
var MODE_HUMAN_HIDER = 2;
var gameMode = -1;

function currentG(){
    return Math.sqrt(1+scores.length);
}
// get mouse position
function getMousePosition(canvas, evt) {
    var x = evt.offsetX==undefined?evt.layerX:evt.offsetX;
    var y = evt.offsetY==undefined?evt.layerY:evt.offsetY;
    return {
        x: x,
        y: y
    };
}

function checkGameOver() {
    if (scores.length < nShots) {
        return false;
    }
    return true;
}

function postScore() {
    var wr = "";
    if (wr == "") {
        wr = "guest";
    }
    var scoreUpperBound = Math.sqrt(Math.pow(canvasWidth,2)+Math.pow(canvasHeight,2));
    userScore = ((scoreUpperBound-bestSeekerScore)/scoreUpperBound)*100;
    document.location.href="/drecco/index.php?task=GravityGameV3&winner="+wr+"&ws="+userScore.toFixed(2);
}

function inStartingArea(x, y){
    return x >= 0 && x <= startWidth;
}

function moveValid(x, y) {
    if (x >= canvasWidth || y >= canvasHeight || x < 0 || y < 0) {
        return false;
    }
    return true;
}

function inPlanetArea(x, y){
    if (x >= canvasWidth - endWidth || y >= canvasHeight || x < startWidth || y < 0) {
        return false;
    }
    return true;
}

function clearBoard() {
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.fillStyle="#222222";
    ctx.fillRect(0,0,startWidth,canvasHeight);
    for(var i=0;i<nStars;i++){
        ctx.fillStyle="#FFFFFF";
        ctx.fillRect(stars[i][0], stars[i][1], 1, 1);
    }
}

function initBoard() {
    clearBoard();
    drawBoard();
}

function resetBoard() {
    currentPlayer = 0;
    planets = [];
    changeGameMode(gameMode);
    window.clearInterval(missileUpdateID);
    scores = [];
    clearBoard();
    drawBoard();
}

function changeGameMode(i){
    console.log("Changing mode to "+i);
    if(i == MODE_TWO_HUMAN_PLAYERS){
        PLAYER_HIDER_STATE = HUMAN;
        PLAYER_SEEKER_STATE = HUMAN;
        gameMode = MODE_TWO_HUMAN_PLAYERS;
        gameState = PUT_PLANETS;
    }else if(i == MODE_HUMAN_SEEKER){
        PLAYER_HIDER_STATE = CPU;
        PLAYER_SEEKER_STATE = HUMAN;
        gameMode = MODE_HUMAN_SEEKER;
        makeAIPlanetSelections();
        currentPlayer = 1 - currentPlayer;
        gameState = CHOOSE_START;
    }else if(i == MODE_HUMAN_HIDER){
        PLAYER_HIDER_STATE = HUMAN;
        PLAYER_SEEKER_STATE = CPU;
        gameMode = MODE_HUMAN_HIDER;
        gameState = PUT_PLANETS;
    }
}

function drawStones() {
    for (var i=0; i<nPlayers; i++) {
        for (var j=0; j<moves[i].length; j++) {
            ctx.fillStyle = color2String(dark_colors[i]);
            ctx.beginPath();
            ctx.arc(moves[i][j][0], moves[i][j][1], 2, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
        }
    }
}

function moveMissile(){
    var eta = 0.1;
    d2x = 0;
    d2y = 0;
    for(var i=0;i<planets.length;i++){
        planet = planets[i];
        dist = Math.pow(planet[0]-missileX, 2)+Math.pow(planet[1]-missileY, 2)+epsilon;
        gPull = currentG()*planetsMass[i]/dist;
        // make gravitational stronger for super black hole
        if(i==superBlackHoleIndex) {
            gPullMultiplier = 1+(scores.length/2)
            gPull = gPull*gPullMultiplier
        }
        d2x += gPull*(planet[0]-missileX);
        d2y += gPull*(planet[1]-missileY);
    }
    missiledX += eta*d2x;
    missiledY += eta*d2y;
    missileX += eta*missiledX;
    missileY += eta*missiledY;
    currentScore = Math.min(Math.sqrt(Math.pow(missileX - target[0], 2)+Math.pow(missileY - target[1], 2)),
                            currentScore);
    missileTimeSteps++;
    displayScores();
    if(missileTimeSteps > 1000 || missileX >= canvasWidth || missileY >= canvasHeight || missileX < 0 || missileY <0){
        window.clearInterval(missileUpdateID);
        missileX = -1;
        missileY = -1;
        missileTimeSteps = 0;
        gameState = CHOOSE_SHOT;
        scores.push(Math.floor(currentScore));
        currentScore = Infinity;
        displayScores();
        if(gameMode == MODE_HUMAN_HIDER){
            makeNextCPUSeekerMove();
        }
    }
    clearBoard();
    drawBoard();
}

function drawBoard(x1, y1, x2, y2) {
    for(var i=0;i<planets.length;i++){
        planet = planets[i];
        if(i==superBlackHoleIndex) {
            ctx.drawImage(blackHoleImg, planet[0], planet[1], 50+scores.length*10, 50+scores.length*10)
        }else{
            ctx.drawImage(blackHoleImg, planet[0], planet[1], 50, 50);
        }
    }
    if(missileX != -1){
        var angle = 0;
        if(missiledX != -1 && missiledX != 0){
            angle = Math.atan(missiledY / missiledX);
        }
        ctx.drawImage(rotateAndCache(missileImg, angle - 1.5), missileX - 10, missileY - 10);
    }
    ctx.drawImage(targetImg, target[0]-10, target[1]-10);
    if(x1 != null && y1 != null && x2 != null && y2 != null){
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#ee2222";
        ctx.stroke();
    }
    if(checkGameOver()){
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#AA2222";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "30px Arial";
        ctx.fillText("Game over! Play again ?", canvasWidth / 2 - 80,  canvasHeight / 2);
    }
}

function makeAIPlanetSelections() {
    // make AI planet selections until hider turn is over
    // this is the only situation where the CPU goes first
    // so put the 2 planets on the board
    // TODO: make CPU place planets in non-random locations?
    while(planets.length < nPlanets) {
        var randX = getRandomInt(startWidth,canvasWidth-endWidth);
        var randY = getRandomInt(0,canvasHeight);
        planets.push([randX,randY]);
        console.log("Adding planets");
        console.log(randX);
        console.log(randY);
    }
}

function makeNextCPUSeekerMove() {
    if(scores.length >= nShots){
        return;
    }
    startX = getRandomInt(0,startWidth);
    startY = getRandomInt(0,canvasHeight);
    endX = target[0];
    endY = target[1];
    if(inStartingArea(startX,startY)) {
        missileX = startX;
        missileY = startY;
        var speedNorm = Math.sqrt(Math.pow(endX-startX, 2)+Math.pow(endY-startY, 2));
        missiledX = speed*(endX-startX)/speedNorm;
        missiledY = speed*(endY-startY)/speedNorm;
        missileUpdateID = setInterval(moveMissile, 10);
    }
}
function displayScores() {
    scoreHTML = "";
    if(currentScore != Infinity){
        scoreHTML += "Current distance : "+Math.floor(currentScore)+"<br/>";
    }
    if(scores.length >= 1){
        scoreHTML += "SpaceX best score : "+Math.min.apply(null, scores)+" <br />";
    }
    if(checkGameOver()){
        scoreHTML += "GAME OVER<br />";
        bestSeekerScore = Math.min.apply(null, scores);
    }
    scoreBox.innerHTML = scoreHTML;
}

canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePosition(canvas, evt);
    if(gameState == CHOOSE_DIRECTION){
        clearBoard();
        drawBoard(missileX, missileY, mousePos.x, mousePos.y);
    }
}, false);

canvas.addEventListener('click', function(evt) {
    // check if game is over
    if (checkGameOver()) {
        resetBoard();
        message.innerHTML = "No more moves";
        console.log("GAME OVER!")
        return;
    }
    // check if mouse position is valid
    var mousePos = getMousePosition(canvas, evt);
    if (!moveValid(mousePos.x, mousePos.y)) {
        message.innerHTML = "<div style=\"color:red;\">Invalid move "+mousePos.x+", "+mousePos.y+"</div>";
        return;
    }
    // check which step of the game we are currently at
    if(gameState == CHOOSE_SHOT){
        gameState = CHOOSE_START;
    }
    if(gameState == PUT_PLANETS){
        if(inPlanetArea(mousePos.x, mousePos.y)){
            planets.push([mousePos.x - 15, mousePos.y - 15]);
            if(planets.length >= nPlanets){
                gameState = CHOOSE_START;
                currentPlayer = 1 - currentPlayer;
                if(PLAYER_SEEKER_STATE==CPU) {
                    makeNextCPUSeekerMove();
                }
            }
        }
    }else{
        if(currentPlayer == PLAYER_SEEKER && PLAYER_SEEKER_STATE==HUMAN){
            // seeker is human, proceed as usual
            if(gameState == CHOOSE_START){
                if(missileX != -1){
                    console.log("Missile in progress.....");
                }else if(inStartingArea(mousePos.x, mousePos.y)){
                    missileX = mousePos.x;
                    missileY = mousePos.y;
                    gameState = CHOOSE_DIRECTION;
                }
            }else if(gameState == CHOOSE_DIRECTION){
                var speedNorm = Math.sqrt(Math.pow(mousePos.x-missileX, 2)+Math.pow(mousePos.y-missileY, 2));
                missiledX = currentG()*speed*(mousePos.x - missileX)/speedNorm;
                missiledY = currentG()*speed*(mousePos.y - missileY)/speedNorm;
                missileUpdateID = setInterval(moveMissile, 10);
                gameState = CHOOSE_START;
            }
        }else{
            // hider is taking the last score as best score
            if(mousePos.x <= canvasWidth / 2){
                seekerScore = scores[scores.length - 1];
                hiderScore = seekerScore;
            }
            currentPlayer = 1 - currentPlayer;
        }
    }
    clearBoard();
    drawBoard();
    //message.innerHTML = "Player " + (currentPlayer + 1) + " to move";
}, false);

/*
Game modes:
1 player: humans play as either HIDER or SEEKER
2 player: humans play as both HIDER and SEEKER
*/
resetButton.addEventListener('click', resetBoard, false);
//scoreButton.addEventListener('click', postScore, false);

var rad = document.getElementById("gameModeForm");
var createChangeMode = function(i){
    return function(){
        changeGameMode(i);
        resetBoard();
    }
}
for(var i = 0; i < rad.length; i++) {
    rad[i].onclick = createChangeMode(i);
}
initBoard();
changeGameMode(0);

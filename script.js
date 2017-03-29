var canvas = $("#canvas")[0];
var ctx = canvas.getContext('2d');

var canvasWidth = ctx.canvas.width = $(window).width()-50;
var canvasHeight = ctx.canvas.height = '500';
var grid = 20;
var repeatX = canvasWidth / grid;
var repeatY = canvasHeight / grid;

function initWorm(){
    paramWorm = { 
    pathCoordinat: [   // start position
        {
            x: 0.5*grid,
            y: 0.5*grid,
            nextPos: 40,
            active: true
        },{
            x: 0.5*grid,
            y: 1.5*grid,
            nextPos: 40,
            active: true
        },{
            x: 0.5*grid,
            y: 2.5*grid,
            nextPos: 40,
            active: true
        },{
            x: 0.5*grid,
            y: 3.5*grid,
            nextPos: 40,
            active: true
        },{
            x: 0.5*grid,
            y: 4.5*grid,
            nextPos: 40,
            active: true
        }],
        pointToGet: [],
    }
}
var paramWorm;
initWorm();

var result = {
    lengthWorm: 5,
    points: 0,
    bestPoints: 0,
    spead: 500,
    lvl: 1,
    nextLvlPoints: 10
}

function checkLVL(){
    result.lengthWorm = paramWorm.pathCoordinat.length;
    result.points += 100;
    $('.result span').html(result.points);
    if (result.lengthWorm >= result.nextLvlPoints && result.spead > 100){
        clearInterval(animationWorm);
        result.spead -= 100;
        result.nextLvlPoints += 5; 
        clearInterval(animationWorm);
        init();
    }
}


// lvl : 1 spead - 500, length - 5
// lvl : 2 spead - 500, length - 10
// lvl : 3 spead - 500, length - 15
// lvl : 4 spead - 500, length - 20
// lvl : 5 spead - 500, length - 25
// lvl : 6 spead - 500, length - 30

function drawGrid(canvasWidth, canvasHeight, grid){  
    var x = grid, y = grid;

    for ( var i = 0; i < repeatX; i++ ){  // ..vertical line
        ctx.beginPath();
        ctx.moveTo( x, 0 );
        ctx.lineTo( x, canvasHeight );
        ctx.strokeStyle = 'rgba(100,100,100,0.1)'
        ctx.stroke();
        x += grid;
    }

    for ( var i = 0; i < repeatY; i++ ){  // ..horizontal line
        ctx.beginPath();
        ctx.moveTo( 0, y );
        ctx.lineTo( canvasWidth, y );
        ctx.strokeStyle = 'rgba(100,100,100,0.1)'
        ctx.stroke();
        y += grid;
    }
}

function buildWorm(paramWorm){
    var coordX, coordY;
    var check = checkEndGame();
    if ( !check ) {
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        drawPointAndWorms(paramWorm.pathCoordinat);
        if (paramWorm.pointToGet.length > 0) {
            drawPointAndWorms(paramWorm.pointToGet);
        }
        drawGrid(canvasWidth, canvasHeight, grid);
    }  else {
        drawGrid(canvasWidth, canvasHeight, grid);
    }
}

function drawPointAndWorms(arrPoint){
    for ( var h = 0; h < arrPoint.length; h++){
        if (arrPoint[h].active){
            var currentX = arrPoint[h].x;
            var currentY = arrPoint[h].y;
            ctx.fillStyle = "rgb(255,0,0)";
            ctx.fillRect( parseInt(currentX/grid)*grid, parseInt(currentY/grid)*grid, grid, grid );
        }
    }
}

function checkEndGame(){
    var checkPoint = paramWorm.pathCoordinat[paramWorm.pathCoordinat.length-1];
    if (checkPoint.x < 0 || checkPoint.y < 0 || checkPoint.x > canvasWidth || checkPoint.y > canvasHeight) {
        showGameOver();
        return true;
    }
    for (var i = 0; i < paramWorm.pathCoordinat.length-1; i++){
        if (paramWorm.pathCoordinat[i].active && paramWorm.pathCoordinat[i].x ==  checkPoint.x && paramWorm.pathCoordinat[i].y ==  checkPoint.y){
            showGameOver();
            return true;
        }
    }
    return false;
}

function showGameOver(){
    clearInterval(animationWorm);
    $('.game-wrap').append('<div>Game Over</div>');
    $('.result span').html(result.points);
    if (Number($('.best-result span').html()) < result.points){
        result.bestPoints = result.points;
        $('.best-result span').html(result.bestPoints);
        localStorage.setItem('wormResult', String(result.points));
    }

    console.log(paramWorm);
    return true;
}

function handleAnimateWorm(){
    var param = Object.assign({}, paramWorm);

        for (var i = 0; i < param.pathCoordinat.length; i++){ //left = 37, up = 38, right = 39, down = 40,
            if (param.pathCoordinat[i].active){
                if (param.pathCoordinat[i].nextPos == 40) {
                    param.pathCoordinat[i].y += grid;
                    param.pathCoordinat[i].nextPos = param.pathCoordinat[i+1] ? param.pathCoordinat[i+1].nextPos : param.pathCoordinat[i].nextPos;

                } else if (param.pathCoordinat[i].nextPos == 39){
                    param.pathCoordinat[i].x += grid;
                    param.pathCoordinat[i].nextPos = param.pathCoordinat[i+1] ? param.pathCoordinat[i+1].nextPos : param.pathCoordinat[i].nextPos;

                } else if (param.pathCoordinat[i].nextPos == 38){
                    param.pathCoordinat[i].y -= grid;
                    param.pathCoordinat[i].nextPos = param.pathCoordinat[i+1] ? param.pathCoordinat[i+1].nextPos : param.pathCoordinat[i].nextPos;

                } else if (param.pathCoordinat[i].nextPos == 37){
                    param.pathCoordinat[i].x -= grid;
                    param.pathCoordinat[i].nextPos = param.pathCoordinat[i+1] ? param.pathCoordinat[i+1].nextPos : param.pathCoordinat[i].nextPos;
                }
            } else {
                var checkActive = true;
                if ( param.pathCoordinat[i+1].active !== false ){
                    if (param.pathCoordinat[i].x == param.pathCoordinat[i+1].x && param.pathCoordinat[i].y == param.pathCoordinat[i+1].y){
                        param.pathCoordinat[i].nextPos = param.pathCoordinat[i+1].nextPos
                        param.pathCoordinat[i].active = true;
                        
                    }
                }
            }
        }

        paramWorm = param;
        checkDeactivePoint(); 
        buildWorm(param);
}

$(window).on('keydown', function(event){
    var pressKey = event.keyCode ? event.keyCode : event.which;
    var currentDirect = paramWorm.pathCoordinat[paramWorm.pathCoordinat.length-1].nextPos;

    if ( currentDirect == pressKey) return; 
    if ( currentDirect == 40 && pressKey == 38) return;
    if ( currentDirect == 38 && pressKey == 40) return;
    if ( currentDirect == 37 && pressKey == 39) return;
    if ( currentDirect == 39 && pressKey == 37) return;

    paramWorm.pathCoordinat[paramWorm.pathCoordinat.length-1].nextPos = pressKey;
    handleAnimateWorm(); 
})

function checkDeactivePoint(){

    var newPoint = paramWorm.pointToGet;

    if ( newPoint.length < 0 ) return;
    var currentWormPoint = paramWorm.pathCoordinat;
    var currentWormX = currentWormPoint[currentWormPoint.length-1].x
    var currentWormY = currentWormPoint[currentWormPoint.length-1].y
    for (var i = 0; i < newPoint.length; i++){
        
        if (newPoint[i].x == currentWormX && newPoint[i].y == currentWormY){
            newPoint[i].active = false;
            newPoint[i].nextPos = currentWormPoint[0].nextPos;
            currentWormPoint.unshift(Object.assign({},newPoint[i]));
            setRandomPoint();
            checkLVL();
        }
    }
}

function setRandomPoint(){
    paramWorm.pointToGet = [];
    
    var positX = parseInt(Math.random()*(repeatX - 1) + 1);
    var positY = parseInt(Math.random()*(repeatY - 1) + 1);
    var idPoint = new Date().getTime();
    var newPoint = {
        x: positX*grid+grid/2,
        y: positY*grid+grid/2,
        id: idPoint,
        active: true
    }
    paramWorm.pointToGet.push(newPoint);
}

$(function(){
    $('.game-wrap').append('<div class="control-game"><div class="best-result">You BEST result: <span></span></div><div class="result">Result :<span></span></div><div class="btn-controll"><button type="button" class="restart-game">Restart</button><button type="button" class="start-game">Start</button><button type="button" class="stop-game">Stop</button></div></div>');
    if (localStorage.getItem('wormResult')) {
        $('.best-result span').html(localStorage.getItem('wormResult'));
    }
    $('.stop-game').hide();
    $('.restart-game').hide();
})

$('body').on('click','.start-game', function(){ 
    init(); 
    $('.start-game').hide();
    $('.stop-game').show();
    $('.restart-game').show();
});

$('body').on('click','.stop-game', function(){
    clearInterval(animationWorm); 
    $('.start-game').show();
    $('.stop-game').hide();
});

$('body').on('click','.restart-game', function(){
    clearInterval(animationWorm);
    initWorm();
    result.lengthWorm = 5;
    result.points = 0;
    result.spead = 500;
    result.lvl =  1;
    result.nextLvlPoints = 10;
    init();
    clearInterval(animationWorm);
    $('.start-game').show();
    $('.stop-game').hide();
    $('.restart-game').hide();
});

var animationWorm
function init(){
    setRandomPoint();
    animationWorm = setInterval(function(){ handleAnimateWorm(); }, result.spead);
}
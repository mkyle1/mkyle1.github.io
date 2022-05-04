import {player_path, obst0, obst0_destructable, obst1, obst1_destructable, obst2, obst2_destructable, obst3, obst3_destructable, obst4, obst4_destructable, circle_path} from './object_paths.js';

function distance(x1,y1,x2,y2){
    let dx = x1 - x2;
    let dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
  }

window.onload = function () {
    var canvas = document.getElementById('myCanvas');
    document.body.style.overflow = 'hidden';
    var context = canvas.getContext('2d');
    var width = canvas.width = window.innerWidth - 20;
    var height = canvas.height = window.innerHeight - 40;
    var playerRadius = 30;
    var wallSpeed = window.innerHeight / 600;
    var first = true;
    var dead = false;
    var activeWalls = [];
    var gapWidth = 120;
    var wallHeight = 30;
    var timeOfLastObstacle = Date.now();
    var startTime = Date.now();
    var timeOfLastStep = Date.now();
    var lives = 2;
    var timeLiveLost = Date.now();
    var explosionSound = new Audio('./music/explosion.wav');
    explosionSound.volume = 0.2;
    explosionSound.muted = false;
    var liveLostSound = new Audio('./music/liveLost.wav');
    liveLostSound.volume = 0.2;
    liveLostSound.muted = false;
    var deathSound = new Audio('./music/death.wav');
    deathSound.volume = 0.2;
    deathSound.muted = false;
    //var timeOfLastPrint = Date.now();
    var timeOfLastWallSpeedChange = Date.now();

    var timer = 0;

    var obstaclePaths = [obst0(width), obst1(width), obst2(width), obst3(width), obst4(width)];
    var destructableObstaclePaths = [obst0_destructable(width), obst1_destructable(width), obst2_destructable(width), obst3_destructable(width), obst4_destructable(width)];

    var playerHandle = {
        x: width / 2,
        y: height - 2 * playerRadius,
        rotation: 1,
        x_tip: 0,
        y_tip: -48,
    };
    var reflectionHandle = {
        x_r1: 0,
        y_r1: 0,    //height of first reflection point
        incline_l1: 0,
        x_r2: 0,
        y_r2: 0,    //height of second reflection point
        incline_l2: 0,
        color_r1: "blue",
        x_r3: 0,
        y_r3: 0,    //height of third reflection point
        incline_l3: 0,
        color_r2: "blue",
    };
    var wallHandles = [];

    var canvasHandle = {
        x_left: 0,
        x_right: width,
        y_top: 0,
        y_bottom: height,
    };

    alert("Wilkommen bei meinem Spiel! \n \n Die Wände reflektieren deinen Laser in verschiedenen Farben. \n Drehe den Laser mit 2 Fingern. \n Bewege den Laser mit 2 oder 1 Finger. \n Rote Hindernisse werden durch rote Reflektion zerstört. \n Grüne Hindernisse werden durch grüne Reflektion zerstört.");

    function draw() {
        if(dead == false) {
        context.clearRect(0, 0, width, height);
        drawPathFunc(context, player_path(playerRadius), 1, playerHandle.x, playerHandle.y, playerHandle.rotation , "blue");
        drawPathFunc(context, circle_path(), 1, playerHandle.x_tip, playerHandle.y_tip, playerHandle.rotation, "red");

        //get the needed amount of wall handles
        if (wallHandles.length <= activeWalls.length) {
            for(let i = 0; i <= activeWalls.length; i++){
                wallHandles.push({x: 0, y: 0});
            }
        }

        createObstacle();

        //Safe currently active walls in array!!!!
        for(let i = 0; i < activeWalls.length; i++){
            drawWall(activeWalls[i].color, activeWalls[i].path, activeWalls[i].path_destructable, i);
        }

        //checking player collision with the walls
        var currentTime = Date.now();
        if(isInsideWall(playerHandle.x, playerHandle.y)){
            if(currentTime - timeLiveLost > 500) {
                liveLostSound.play();
                lives = lives - 1;
                timeLiveLost = currentTime;
            }
        }

        //Drawing the laser and its reflections
        drawLaser();
        if(reflectionHandle.y_r1 > 0){
            drawReflection();
        }
        if(reflectionHandle.y_r2 > 0){
            drawReflection2();
        }

        //move all walls
        currentTime = Date.now();
        if(currentTime - timeOfLastStep > 5) {      //move all walls every 5 milliseconds, for consistent time scaling accross devices
            for(var i = 0; i < activeWalls.length; i++){
                moveWall(i);
            }
            timeOfLastStep = currentTime;
        }

       /*  currentTime = Date.now();
        if(currentTime - timeOfLastPrint > 5000) {
            console.dir(activeWalls);
            console.dir(wallHandles);
            timeOfLastPrint = currentTime;
        } */

        //increasing wall speed every 10 seconds
        currentTime = Date.now();
        if((currentTime - timeOfLastWallSpeedChange) >= 10000 && (currentTime - startTime) >= 9000){
            timeOfLastWallSpeedChange = currentTime;
            wallSpeed = wallSpeed + 0.5;
            console.log("wallSpeed: " + wallSpeed);
        }

        checkLaserCollision();
        updateScore();
        requestAnimationFrame(draw);

    } else {
        context.clearRect(0, 0, width, height);
        lives = 5;
        
        //creating an end screen
        context.font = "30px Arial";
        context.fillText("Game Over", width / 2 - 80, height / 2 - 100);
        context.font = "17px Arial";
        context.fillText("Press the button to play again!", width / 2 - 120, height / 2 - 50);
        drawPathFunc(context, circle_path(), 5, width/2, height/2, 0, "black");
        requestAnimationFrame(draw);
    }
    }draw();

    function createObstacle() {
        var currentTime = Date.now();
        if(currentTime - timeOfLastObstacle > 4500 || first){
            first = false;
            timeOfLastObstacle = currentTime;
            console.log("---- NEW OBSTACLE ----");
            var random_obstacle = getRandomIntInclusive(0,4);
            var colorInt = getRandomIntInclusive(0, 1);
            var color;
            if(colorInt === 0){
                color = "red";
            } else if (colorInt === 1) {
                color = "green";
            }
            switch (random_obstacle) {
                case 0:
                    activeWalls.push({path: obst0(width)
                        , path_destructable: obst0_destructable(width)
                        , color: color
                        , l_border: 0
                        , r_border: gapWidth
                        , destroyed: false});
                    wallHandles[activeWalls.length - 1].x = 0;
                    wallHandles[activeWalls.length - 1].y = 0;
                    break;
                case 1:
                    activeWalls.push({path: obst1(width)
                        , path_destructable: obst1_destructable(width)
                        , color: color
                        , l_border: 1/6 * width
                        , r_border: 1/6 * width + gapWidth
                        , destroyed: false});
                    wallHandles[activeWalls.length - 1].x = 0;
                    wallHandles[activeWalls.length - 1].y = 0;
                    break;
                case 2:
                    activeWalls.push({path: obst2(width)
                        , path_destructable: obst2_destructable(width)
                        , color: color
                        , l_border: 2/6 * width
                        , r_border: 2/6 * width + gapWidth
                        , destroyed: false});
                    wallHandles[activeWalls.length - 1].x = 0;
                    wallHandles[activeWalls.length - 1].y = 0;
                    break;
                case 3:
                    activeWalls.push({path: obst3(width)
                        , path_destructable: obst3_destructable(width)
                        , color: color
                        , l_border: 3/6 * width
                        , r_border: 3/6 * width + gapWidth
                        , destroyed: false});
                    wallHandles[activeWalls.length - 1].x = 0;
                    wallHandles[activeWalls.length - 1].y = 0;
                    break;
                case 4:
                    activeWalls.push({path: obst4(width)
                        , path_destructable: obst4_destructable(width)
                        , color: color
                        , l_border: 4/6 * width
                        , r_border: 4/6 * width + gapWidth
                        , destroyed: false});
                    wallHandles[activeWalls.length - 1].x = 0;
                    wallHandles[activeWalls.length - 1].y = 0;
                    break;
                default:
                    break;

            }
        }
    }

    function updateScore() {
        var score = ((Date.now() - startTime) / 1000).toFixed(1);
        document.getElementById("score").innerText = "Time Alive: " + score + " Lives Left: " + lives;
        if(lives <= 0){
            dead = true;
            deathSound.play();
            while(activeWalls.length > 0){
                activeWalls.shift();
            }
            for(let i = 0; i <= activeWalls.length; i++){
                wallHandles[i].x = 0;
                wallHandles[i].y = 0;
            }
        }
    }

    function checkLaserCollision(){ //check if laser collides with destructable wall part
        for(let index = 0; index < activeWalls.length; index++){
            if(wallHandles[index].y < reflectionHandle.y_r1) {      //is first reflection point below the lowest wall?
                if(wallHandles[index].y < reflectionHandle.y_r2) {    //is the second reflection point below the lowest wall? -> 2nd reflected laser hits wall
                    if(activeWalls.length != 0) {
                        if(activeWalls[index].color == reflectionHandle.color_r2) {     //does the wall have the same color as the reflected laser?
                            let x = activeWalls[index].l_border;
                            if(reflectionHandle.incline_l2 > 0) {
                                let y = reflectionHandle.y_r2 + (reflectionHandle.x_r2 - x) * reflectionHandle.incline_l2;
                                for(let i = 0; i < gapWidth; i++){  //for each x value of the destructable wall part
                                    y = y - reflectionHandle.incline_l2;
                                    if(isInsideDestructable(x, y, index)) {
                                        if(activeWalls[index].destroyed == false) {
                                            explosionSound.play();
                                        }
                                        activeWalls[index].destroyed = true;
                                    }
                                    x++;
                                }
                            } else {
                                let y = reflectionHandle.y_r2 + (reflectionHandle.x_r2 - x) * reflectionHandle.incline_l2;
                                for(let i = 0; i < gapWidth; i++){  //for each x value of the destructable wall part
                                    y = y - reflectionHandle.incline_l2;
                                    if(isInsideDestructable(x, y, index)) {
                                        if(activeWalls[index].destroyed == false) {
                                            explosionSound.play();
                                        }
                                        activeWalls[index].destroyed = true;
                                    }
                                    x++;
                                }
                            }
                        }
                    }
                } else {    //1st reflected laser hits wall
                    if(activeWalls.length != 0) {
                        if(activeWalls[index].color == reflectionHandle.color_r1) {     //does the wall have the same color as the reflected laser?
                            console.log("Checking inside");
                            let x = activeWalls[index].l_border;
                            if(reflectionHandle.incline_l1 > 0) {
                                let y = reflectionHandle.y_r1 + (reflectionHandle.x_r1 - x) * reflectionHandle.incline_l1;
                                for(let i = 0; i < gapWidth; i++){  //for each x value of the destructable wall part
                                    y = y - reflectionHandle.incline_l1;
                                    if(isInsideDestructable(x, y, index)) {
                                        if(activeWalls[index].destroyed == false) {
                                            explosionSound.play();
                                        }
                                        activeWalls[index].destroyed = true;
                                    }
                                    x++;
                                }
                            } else {
                                let y = reflectionHandle.y_r1 + (reflectionHandle.x_r1 - x) * reflectionHandle.incline_l1;
                                for(let i = 0; i < gapWidth; i++){  //for each x value of the destructable wall part
                                    y = y - reflectionHandle.incline_l1;
                                    if(isInsideDestructable(x, y, index)) {
                                        if(activeWalls[index].destroyed == false) {
                                            explosionSound.play();
                                        }
                                        activeWalls[index].destroyed = true;
                                    }
                                    x++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    

    function drawWall(color, path, path_destructable, index) {
        drawPathFunc(context, path, 1, 0, wallHandles[index].y, 0, "orange");
        if(activeWalls[index].destroyed == false){
            if(color == "red"){
                drawPathFunc(context, path_destructable, 1, 0, wallHandles[index].y, 0, "red");
            } else {
                drawPathFunc(context, path_destructable, 1, 0, wallHandles[index].y, 0, "green");
            }
        }
    }

    function moveWall(wallIndex) {  //moves the wall using the wall handles, deletes the wall when it reaches the end
        wallHandles[wallIndex].y = wallHandles[wallIndex].y + wallSpeed;
        if(wallHandles[wallIndex].y > height){
            activeWalls.shift();
            wallHandles.shift();
            console.log("---- Lowest Wall Removed ----");
        }
    }

    function drawLaser() {
        let incline = (playerHandle.y_tip - playerHandle.y) / (playerHandle.x_tip - playerHandle.x);
        reflectionHandle.incline_l1 = incline;
        let y_stop;
            //get reflection point
            if (incline > 0 && playerHandle.y_tip < playerHandle.y) {   //Laser inclines to the left
                y_stop = playerHandle.x * -incline + playerHandle.y;
                reflectionHandle.x_r1 = 0;
                reflectionHandle.y_r1 = y_stop;
            } else if (incline < 0 && playerHandle.y_tip < playerHandle.y) {    //Laser inclines to the right
                y_stop = (width - playerHandle.x) * incline + playerHandle.y;
                reflectionHandle.x_r1 = width;
                reflectionHandle.y_r1 = y_stop;
            }
            //draw reflection
            context.beginPath();
            context.strokeStyle = "black";
            context.lineWidth = 1;
            context.moveTo(playerHandle.x_tip, playerHandle.y_tip);
            if (incline > 0) {
                context.lineTo(0, y_stop);
            } else if (incline < 0) {
                context.lineTo(width, y_stop);
            }
            context.stroke();
       
    }

    function drawReflection() {
        let incline = (playerHandle.y_tip - playerHandle.y) / (playerHandle.x_tip - playerHandle.x);
        let y_stop;
        //get reflection point
        incline = -incline;
        reflectionHandle.incline_l2 = incline;
            if (incline > 0 && playerHandle.y_tip < playerHandle.y) {   //Laser inclines to the left
                y_stop = reflectionHandle.x_r1 * -incline + reflectionHandle.y_r1;
                reflectionHandle.x_r2 = 0;
                reflectionHandle.y_r2 = y_stop;
            } else if (incline < 0 && playerHandle.y_tip < playerHandle.y) {    //Laser inclines to the right
                y_stop = (width - reflectionHandle.x_r1) * incline + reflectionHandle.y_r1;
                reflectionHandle.x_r2 = width;
                reflectionHandle.y_r2 = y_stop;
            }
        //draw reflection
        context.beginPath();
        context.lineWidth = 3;
        context.moveTo(reflectionHandle.x_r1, reflectionHandle.y_r1);
        if(reflectionHandle.x_r1 != 0) {
            reflectionHandle.color_r1 = "green";
            context.strokeStyle = "green";
        } else {
            reflectionHandle.color_r1 = "red";
            context.strokeStyle = "red";
        }
        if (incline > 0) {
            context.lineTo(0, y_stop);
        } else if (incline < 0) {
            context.lineTo(width, y_stop);
        }
        context.stroke();
    };

    function drawReflection2() {
        let incline = (playerHandle.y_tip - playerHandle.y) / (playerHandle.x_tip - playerHandle.x);
        let y_stop;
        reflectionHandle.incline_l3 = incline;
        //get reflection point
            if (incline > 0 && playerHandle.y_tip < playerHandle.y) {
                y_stop = reflectionHandle.x_r2 * -incline + reflectionHandle.y_r2;
                reflectionHandle.x_r3 = 0;
                reflectionHandle.y_r3 = y_stop;
            } else if (incline < 0 && playerHandle.y_tip < playerHandle.y) {
                y_stop = (width - reflectionHandle.x_r2) * incline + reflectionHandle.y_r2;
                reflectionHandle.x_r3 = width;
                reflectionHandle.y_r3 = y_stop;
            }
        //draw reflection
        context.beginPath();
        context.lineWidth = 3;
        context.moveTo(reflectionHandle.x_r2, reflectionHandle.y_r2);
        if(reflectionHandle.x_r2 != 0) {
            reflectionHandle.color_r2 = "green";
            context.strokeStyle = "green";
        } else {
            reflectionHandle.color_r2 = "red";
            context.strokeStyle = "red";
        }
        if (incline > 0) {
            context.lineTo(0, y_stop);
        } else if (incline < 0) {
            context.lineTo(width, y_stop);
        }
        context.stroke();
    };

    function drawPathFunc(ctx, path, scale, x, y, angle, color) {
            ctx.fillStyle = color;
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.scale(scale, scale);
            let m = ctx.getTransform();
            ctx.fill(path);
            ctx.resetTransform();
            return m;
    }


    function isInside(x, y, ix, iy, radius) {
        let inside = distance(x, y, ix, iy) < radius * 1.5;
        return inside;
    }

    function isInsideDestructable(x, y, index) {
        if(x > activeWalls[index].l_border && x < activeWalls[index].r_border && y > wallHandles[index].y && y < wallHandles[index].y + wallHeight) {
            return true;
        } else {
            return false;
        }
    }

    function isInsideWall(x, y){
        if(y <= wallHandles[0].y + 30 && y >= wallHandles[0].y){
            if(activeWalls[0].destroyed == true) {
                if(x >= activeWalls[0].l_border && x <= activeWalls[0].r_border){
                    return false;
                } else {
                    //dead = true;
                    return true;
                }
            } else {
                //dead = true;
                return true;
            }
        } else {
            return false;
        }
    }

    document.body.addEventListener("touchstart", function (event) {
        event.preventDefault();
        if(dead == false) {
            if (event.touches.length === 1) {
                    document.body.addEventListener("touchmove", onTouchMove);
                    document.body.addEventListener("touchend", onTouchEnd);
            } else if (event.touches.length === 2) {
                document.body.addEventListener("touchmove", onTouchRotate);
                document.body.addEventListener("touchend", onTouchEnd);
            }
        } else {
            if(isInside(width/2, height/2, event.touches[0].pageX, event.touches[0].pageY, 50)) {
                dead = false;
                console.log("Restart pressed");
                startTime = Date.now();
                timeOfLastObstacle = Date.now();
                wallSpeed = window.innerHeight / 800;
                console.log("Wall Speed: " + wallSpeed);
                requestAnimationFrame(draw);
            }
        }
    }, {passive: false});

    function onTouchRotate(event) {
        event.preventDefault();
        let touch1 = event.touches[0];
        let touch2 = event.touches[1];
        let dx = touch1.pageX - touch2.pageX;
        let dy = touch1.pageY - touch2.pageY;
        let angle = Math.atan2(dy, dx) + 3/2 * Math.PI;
        playerHandle.rotation = angle;
        updateRotation();
    }

    function onTouchMove(event) {
        playerHandle.x = event.touches[0].clientX;
        updateRotation();
    }

    function updateRotation() {     //tracks the tip of the player when rotated
        playerHandle.x_tip =  playerHandle.x + (playerRadius + 13) * Math.sin(playerHandle.rotation);
        if (playerHandle.rotation === 0) {
            playerHandle.y_tip = playerHandle.y - 48;
        } else {
            playerHandle.y_tip = playerHandle.y + (playerRadius + 13) * -Math.cos(playerHandle.rotation);
        }
    }

    function onTouchEnd(event) {
        document.body.removeEventListener("touchmove", onTouchMove);
        document.body.removeEventListener("touchend", onTouchEnd);
    }

}

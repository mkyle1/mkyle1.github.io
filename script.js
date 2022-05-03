import {player_path, obst_path, broken_obst_path, obst0, obst0_destructable, obst1, obst1_destructable, obst2, obst2_destructable, obst3, obst3_destructable, obst4, obst4_destructable} from './object_paths.js';

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
    var height = canvas.height = window.innerHeight - 20;
    var recPath;
    var radius = 30;
    var wallSpeed = 1.5;
    var dead = false;
    var ticksSinceLastObstacle = 0;
    var maxWallHandles = 10
    var nextWallHandleIndex = 0;
    var activeWalls = [];
    var gapWidth = 120;
    var wallHeight = 30;

    //var boolean = false;
    var timer = 0;

    var obstaclePaths = [obst0(width), obst1(width), obst2(width), obst3(width), obst4(width)];
    var destructableObstaclePaths = [obst0_destructable(width), obst1_destructable(width), obst2_destructable(width), obst3_destructable(width), obst4_destructable(width)];

    var playerHandle = {
        x: width / 2,
        y: height - 2 * radius,
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
    //wallHandles.push({x: 0, y: 0});
    var canvasHandle = {
        x_left: 0,
        x_right: width,
        y_top: 0,
        y_bottom: height,
    };

    function draw() {
        context.clearRect(0, 0, width, height);
        //drawRectangle(playerHandle.x, playerHandle.y);
        drawPathFunc(context, player_path(radius), 1, playerHandle.x, playerHandle.y, playerHandle.rotation , "blue");
        drawPathFunc(context, laser_path(), 1, playerHandle.x_tip, playerHandle.y_tip, playerHandle.rotation, "red");
        drawPathFunc(context, laser_path(), 1, reflectionHandle.x_r1, reflectionHandle.y_r1, playerHandle.rotation, "yellow");

        /* if(boolean == true){
            drawPathFunc(context, player_path(radius), 1, 300,400, 0 , "purple");
            if(timer >= 200){
                boolean = false;
                timer = 0;
            }
            timer++;
        } */

        //get the needed amount of wall handles
        if (wallHandles.length <= activeWalls.length) {
            for(let i = 0; i <= activeWalls.length; i++){
                wallHandles.push({x: 0, y: 0});
            }
        }
        //drawWall(0, obst4(width), obst4_destructable(width));
        if(ticksSinceLastObstacle > 500){
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
                    //handleWallHandleIndex();
                    activeWalls.push({path: obst0(width)
                        , path_destructable: obst0_destructable(width)
                        , color: color
                        , l_border: 0
                        , r_border: gapWidth
                        , destroyed: false});
                    //drawWall(color, obst0(width), obst0_destructable(width));
                    break;
                case 1:
                    //handleWallHandleIndex();
                    activeWalls.push({path: obst1(width)
                        , path_destructable: obst1_destructable(width)
                        , color: color
                        , l_border: 1/6 * width
                        , r_border: 1/6 * width + gapWidth
                        , destroyed: false});
                    //drawWall(color, obst1(width), obst1_destructable(width));
                    break;
                case 2:
                    //handleWallHandleIndex();
                    activeWalls.push({path: obst2(width)
                        , path_destructable: obst2_destructable(width)
                        , color: color
                        , l_border: 2/6 * width
                        , r_border: 2/6 * width + gapWidth
                        , destroyed: false});
                    //drawWall(color, obst2(width), obst2_destructable(width));
                    break;
                case 3:
                    //handleWallHandleIndex();
                    activeWalls.push({path: obst3(width)
                        , path_destructable: obst3_destructable(width)
                        , color: color
                        , l_border: 3/6 * width
                        , r_border: 3/6 * width + gapWidth
                        , destroyed: false});
                    //drawWall(color, obst3(width), obst3_destructable(width));
                    break;
                case 4:
                    //handleWallHandleIndex();
                    activeWalls.push({path: obst4(width)
                        , path_destructable: obst4_destructable(width)
                        , color: color
                        , l_border: 4/6 * width
                        , r_border: 4/6 * width + gapWidth
                        , destroyed: false});
                    //drawWall(color, obst4(width), obst4_destructable(width));
                    break;
                default:
                    break;

            }
            ticksSinceLastObstacle = 0;
        }
        //Safe currently active walls in array!!!!
        nextWallHandleIndex = 0;
        for(let i = 0; i < activeWalls.length; i++){
            drawWall(activeWalls[i].color, activeWalls[i].path, activeWalls[i].path_destructable, i);
        }

        if(isInsideWall(playerHandle.x, playerHandle.y)){
            if(timer > 20) {
            //console.log("---- PLAYER INSIDE WALL ----");
            //console.dir(wallHandles)
            timer = 0;
            }
            timer++;
        }


        /* if(ticksSinceLastObstacle % 200 == 0){
            console.dir(activeWalls);
            console.dir(wallHandles);
        } */
        ticksSinceLastObstacle++;

        //Drawing the laser and its reflections
        drawLaser();
        if(reflectionHandle.y_r1 > 0){
            drawReflection();
        }
        if(reflectionHandle.y_r2 > 0){
            drawReflection2();
        }

        //move all walls in the array
        for(var i = 0; i < activeWalls.length; i++){
            moveWall(i);
        }

        checkLaserCollision();

        //if collided
        if(!dead) {
            requestAnimationFrame(draw);
        }
    }draw();

    function checkLaserCollision(){ //check if laser collides with destructable wall part
        if(wallHandles[0].y < reflectionHandle.y_r1) {      //is first reflection point below the lowest wall?
            if(wallHandles[0].y < reflectionHandle.y_r2) {    //is the second reflection point below the lowest wall? -> 2nd reflected laser hits wall
                if(activeWalls.length != 0) {
                    if(activeWalls[0].color == reflectionHandle.color_r2) {     //does the wall have the same color as the reflected laser?
                        console.log("Checking inside");
                        let x = activeWalls[0].l_border;
                        //let y = reflectionHandle.y_r1 + (x - reflectionHandle.x_r1) * reflectionHandle.incline_l1;
                        if(reflectionHandle.incline_l2 > 0) {
                            //let y = wallHandles[0].y + wallHeight;
                            let y = reflectionHandle.y_r2 + (reflectionHandle.x_r2 - x) * reflectionHandle.incline_l2;
                            for(let i = 0; i < gapWidth; i++){  //for each x value of the destructable wall part
                                y = y - reflectionHandle.incline_l2;
                                //drawPathFunc(context, laser_path(), 1, x, y, "blue");
                                if(isInsideDestructable(x, y, 0)) {
                                    activeWalls[0].destroyed = true;
                                }
                                x++;
                            }
                        } else {
                            //let y = wallHandles[0].y;
                            let y = reflectionHandle.y_r2 + (reflectionHandle.x_r2 - x) * reflectionHandle.incline_l2;
                            for(let i = 0; i < gapWidth; i++){  //for each x value of the destructable wall part
                                y = y - reflectionHandle.incline_l2;
                                //drawPathFunc(context, laser_path(), 1, x, y, "blue");
                                if(isInsideDestructable(x, y, 0)) {
                                    activeWalls[0].destroyed = true;
                                }
                                x++;
                            }
                        }
                    }
                }
            } else {    //1st reflected laser hits wall
                if(activeWalls.length != 0) {
                    if(activeWalls[0].color == reflectionHandle.color_r1) {     //does the wall have the same color as the reflected laser?
                        console.log("Checking inside");
                        let x = activeWalls[0].l_border;
                        //let y = reflectionHandle.y_r1 + (x - reflectionHandle.x_r1) * reflectionHandle.incline_l1;
                        if(reflectionHandle.incline_l1 > 0) {
                            //let y = wallHandles[0].y + wallHeight;
                            let y = reflectionHandle.y_r1 + (reflectionHandle.x_r1 - x) * reflectionHandle.incline_l1;
                            for(let i = 0; i < gapWidth; i++){  //for each x value of the destructable wall part
                                y = y - reflectionHandle.incline_l1;
                                //drawPathFunc(context, laser_path(), 1, x, y, "blue");
                                if(isInsideDestructable(x, y, 0)) {
                                    activeWalls[0].destroyed = true;
                                }
                                x++;
                            }
                        } else {
                            //let y = wallHandles[0].y;
                            let y = reflectionHandle.y_r1 + (reflectionHandle.x_r1 - x) * reflectionHandle.incline_l1;
                            for(let i = 0; i < gapWidth; i++){  //for each x value of the destructable wall part
                                y = y - reflectionHandle.incline_l1;
                                //drawPathFunc(context, laser_path(), 1, x, y, "blue");
                                if(isInsideDestructable(x, y, 0)) {
                                    activeWalls[0].destroyed = true;
                                }
                                x++;
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
        wallHandles[wallIndex].y += wallSpeed;
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

    function laser_path() {   //path for dot for testing
        let path = new Path2D();
        path.arc(0, 0, 5, 0, Math.PI * 2, true);
        return path;
    }

    function drawPathFunc(ctx, path, scale, x, y, angle, color) {
            ctx.fillStyle = color;
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.scale(scale, scale);
            let m = ctx.getTransform();  // movingMatrix == T
            ctx.fill(path);
            ctx.resetTransform();
            return m;
    }


    function isInside(ix, iy) {
        let inside = distance(playerHandle.x, playerHandle.y, ix, iy) < radius * 1.5;
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
        if (event.touches.length === 1 && isInside(event.touches[0].pageX, event.touches[0].pageY)) {
                document.body.addEventListener("touchmove", onTouchMove);
                document.body.addEventListener("touchend", onTouchEnd);
                //console.log("Touch is inside");
        } else if (event.touches.length === 2) {
            event.preventDefault();
            document.body.addEventListener("touchmove", onTouchRotate);
            document.body.addEventListener("touchend", onTouchEnd);
        } else if (event.touches.length === 3) {
            /* event.preventDefault();
            document.body.addEventListener("touchmove", onTouchRotate);
            document.body.addEventListener("onclick", onTouchShoot);
            document.body.addEventListener("touchend", onTouchEnd); */
        }
    }, {passive: false});

    /* function onTouchShoot(event) {
        boolean = true;
    } */

    function onTouchRotate(event) {
        event.preventDefault();
        let touch1 = event.touches[0];
        let touch2 = event.touches[1];
        let dx = touch1.pageX - touch2.pageX;
        let dy = touch1.pageY - touch2.pageY;
        let angle = Math.atan2(dy, dx) + 3/2 * Math.PI;
        //console.log("Winkel: " + angle);
        playerHandle.rotation = angle;
        updateRotation();
    }

    function onTouchMove(event) {
        /* if (event.touches[0].clientX < playerHandle.x) {
            playerHandle.x = event.touches[0].clientX + playerHandle.x - rectangleWidth / 2;
        } else if (event.touches[0].clientX > playerHandle.x) {
            playerHandle.x = event.touches[0].clientX - playerHandle.x - rectangleWidth / 2;
        } */

        playerHandle.x = event.touches[0].clientX;
        updateRotation();
    }

    function updateRotation() {     //tracks the tip of the player when rotated
        playerHandle.x_tip =  playerHandle.x + (radius + 13) * Math.sin(playerHandle.rotation);
        if (playerHandle.rotation === 0) {
            playerHandle.y_tip = playerHandle.y - 48;
        } else {
            playerHandle.y_tip = playerHandle.y + (radius + 13) * -Math.cos(playerHandle.rotation);
        }
    }

    function onTouchEnd(event) {
        document.body.removeEventListener("touchmove", onTouchMove);
        document.body.removeEventListener("touchend", onTouchEnd);
    }

    //store the fingers in an array
    let fingers = [];
    function setFingers(touches) {
        for (let t of touches) {
            fingers[t.identifier] = {
                x: t.pageX,
                y: t.pageY,
            }
        }
    }

    function rmFingers(touches) {
        for (let t of touches) {
            console.log("rm", t);
            fingers[t.identifier] = undefined
        }
    }

}

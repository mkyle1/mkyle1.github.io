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
    var wallSpeed = 1;
    var dead = false;
    var ticksSinceLastObstacle = 0;
    var maxWallHandles = 10
    var nextWallHandleIndex = 0;
    var activeWalls = [];

    var playerHandle = {
        x: width / 2,
        y: height - 2 * radius,
        rotation: 1,
        x_tip: 0,
        y_tip: -48,
    };
    var reflectionHandle = {
        x_r1: 0,
        y_r1: 0,
        x_r2: 0,
        y_r2: 0,
        x_r3: 0,
        y_r3: 0,
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
        //drawPathFunc(context, obst_path(width), 1, wallHandles[0].x, wallHandles[0].y, 0, "orange");
        //wallHandles.push({x: 0, y: -600});
        //console.dir(wallHandles);
        //drawPathFunc(context, broken_obst_path(width), 1, wallHandles[1].x, wallHandles[1].y, 0, "purple");
        /* drawPathFunc(context, obst4(width), 1, wallHandles[0].x, wallHandles[0].y, 0, "orange");
        drawPathFunc(context, obst4_destructable(width), 1, wallHandles[0].x, wallHandles[0].y, 0, "red"); */

        //get the needed amount of wall handles
        if (wallHandles.length <= activeWalls.length) {
            for(let i = 0; i <= activeWalls.length; i++){
                wallHandles.push({x: 0, y: 0});
            }
        }
        //drawWall(0, obst4(width), obst4_destructable(width));
        if(ticksSinceLastObstacle > 600){
            console.log("---- NEW OBSTACLE ----");
            var random_obstacle = getRandomIntInclusive(0,4);
            var color = getRandomIntInclusive(0, 1);
            switch (random_obstacle) {
                case 0:
                    //handleWallHandleIndex();
                    activeWalls.push({path: obst0(width), path_destructable: obst0_destructable(width), color: color});
                    //drawWall(color, obst0(width), obst0_destructable(width));
                    break;
                case 1:
                    //handleWallHandleIndex();
                    activeWalls.push({path: obst1(width), path_destructable: obst1_destructable(width), color: color});
                    //drawWall(color, obst1(width), obst1_destructable(width));
                    break;
                case 2:
                    //handleWallHandleIndex();
                    activeWalls.push({path: obst2(width), path_destructable: obst2_destructable(width), color: color});
                    //drawWall(color, obst2(width), obst2_destructable(width));
                    break;
                case 3:
                    //handleWallHandleIndex();
                    activeWalls.push({path: obst3(width), path_destructable: obst3_destructable(width), color: color});
                    //drawWall(color, obst3(width), obst3_destructable(width));
                    break;
                case 4:
                    //handleWallHandleIndex();
                    activeWalls.push({path: obst4(width), path_destructable: obst4_destructable(width), color: color});
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


        if(ticksSinceLastObstacle % 200 == 0){
            console.dir(activeWalls);
            console.dir(wallHandles);
        }
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

        //if collided
        if(!dead) {
            requestAnimationFrame(draw);
        }
    }draw();

    function drawWall(color, path, path_destructable, index) {
        drawPathFunc(context, path, 1, 0, wallHandles[index].y, 0, "orange");
        if(color == 0){     //0 = red
            drawPathFunc(context, path_destructable, 1, 0, wallHandles[index].y, 0, "red");
        } else {
            drawPathFunc(context, path_destructable, 1, 0, wallHandles[index].y, 0, "green");
        }
    }

    function handleWallHandleIndex () {
        if (nextWallHandleIndex + 1 >= activeWalls.length) {
            nextWallHandleIndex = 0;
        } else if (nextWallHandleIndex + 1 < activeWalls.length) {
            nextWallHandleIndex++;
        }
    }

    function moveWall(wallIndex) {
        wallHandles[wallIndex].y += wallSpeed;
        if(wallHandles[wallIndex].y > playerHandle.y){
            /* wallHandles.splice(wallIndex, 1);
            wallHandles.splice(wallIndex, 0, {x: 0, y: 0}); */
            activeWalls.shift();
            wallHandles.shift();
            console.log("---- Lowest Wall Removed ----");
        }
    }

    function drawLaser() {
        let incline = (playerHandle.y_tip - playerHandle.y) / (playerHandle.x_tip - playerHandle.x);
        let y_stop;
            //get reflection point
            if (incline > 0 && playerHandle.y_tip < playerHandle.y) {
                y_stop = playerHandle.x * -incline + playerHandle.y;
                reflectionHandle.x_r1 = 0;
                reflectionHandle.y_r1 = y_stop;
            } else if (incline < 0 && playerHandle.y_tip < playerHandle.y) {
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
            if (incline > 0 && playerHandle.y_tip < playerHandle.y) {
                y_stop = reflectionHandle.x_r1 * -incline + reflectionHandle.y_r1;
                reflectionHandle.x_r2 = 0;
                reflectionHandle.y_r2 = y_stop;
            } else if (incline < 0 && playerHandle.y_tip < playerHandle.y) {
                y_stop = (width - reflectionHandle.x_r1) * incline + reflectionHandle.y_r1;
                reflectionHandle.x_r2 = width;
                reflectionHandle.y_r2 = y_stop;
            }
        //draw reflection
        context.beginPath();
        context.lineWidth = 3;
        context.moveTo(reflectionHandle.x_r1, reflectionHandle.y_r1);
        if(reflectionHandle.x_r1 != 0) {
            context.strokeStyle = "green";
        } else {
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
            context.strokeStyle = "green";
        } else {
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
        /* if (context.isPointInPath(object_path(), ix, iy)) {
            console.log("Touch is inside");
            return true;
        } else {
            console.log("Touch is not inside");
            return false;
        } */
        let inside = distance(playerHandle.x, playerHandle.y, ix, iy) < radius * 1.5;
        return inside;
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
        }
    }, {passive: false});

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

    function updateRotation() {
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

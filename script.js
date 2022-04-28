function distance(x1,y1,x2,y2){
    let dx = x1 - x2;
    let dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

window.onload = function () {
    var canvas = document.getElementById('myCanvas');
    document.body.style.overflow = 'hidden';
    var context = canvas.getContext('2d');
    var width = canvas.width = window.innerWidth - 20;
    var height = canvas.height = window.innerHeight - 20;
    var recPath;
    var radius = 30;
    var playerHandle = {
        x: width / 2,
        y: height - 2 * radius,
        rotation: 0,
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
    var canvasHandle = {
        x_left: 0,
        x_right: width,
        y_top: 0,
        y_bottom: height,
    };

    function draw() {
        context.clearRect(0, 0, width, height);
        //drawRectangle(playerHandle.x, playerHandle.y);
        drawPathFunc(context, object_path(), 1, playerHandle.x, playerHandle.y, playerHandle.rotation , "blue");
        drawPathFunc(context, laser_path(), 1, playerHandle.x_tip, playerHandle.y_tip, playerHandle.rotation, "red");
        drawPathFunc(context, laser_path(), 1, reflectionHandle.x_r1, reflectionHandle.y_r1, playerHandle.rotation, "yellow");      
        drawLaser();
        if(reflectionHandle.y_r1 > 0){
            drawReflection();
        }
        if(reflectionHandle.y_r2 > 0){
            drawReflection2();
        }

        requestAnimationFrame(draw);
    }draw();

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

    function object_path() {    //path for player figure
        let path = new Path2D();
        path.arc(0, 0, radius, 0, Math.PI * 2, true);
        path.moveTo(0, -48);
        path.lineTo(12, -27);
        path.lineTo(-12, -27);
        //path.arcTo(2, -9, -2, -9, 10);
        path.lineTo(0, -48);
        path.closePath();
        return path;
    }

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
        let inside = distance(playerHandle.x, playerHandle.y, ix, iy) < radius;
        return inside;
    }

    document.body.addEventListener("touchstart", function (event) {
        if (event.touches.length === 1 && isInside(event.touches[0].pageX, event.touches[0].pageY)) {
                document.body.addEventListener("touchmove", onTouchMove);
                document.body.addEventListener("touchend", onTouchEnd);
                console.log("Touch is inside");
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
        //playerHandle.y = event.touches[0].clientY;
        draw();
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

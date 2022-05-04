var gapWidth = 120;

export function obst_path(width) {
    let path = new Path2D();
    path.moveTo(0,0);
    path.lineTo(width,0);
    path.lineTo(width,30);
    path.lineTo(0,30);
    path.lineTo(0,0);
    path.closePath();

    return path;
}

export function obst0(width) {
    let path = new Path2D();
    
    //rechter Teil
    path.moveTo(gapWidth, 0);
    path.lineTo(width, 0);
    path.lineTo(width, 30);
    path.lineTo(gapWidth, 30);
    path.lineTo(gapWidth, 0);
    path.closePath();
    path.closePath();
    
    return path;
}
export function obst0_destructable(width) {
    let path = new Path2D();
    path.moveTo(0, 0);
    path.lineTo(10, -5);
    path.lineTo(gapWidth - 10, -5);
    path.lineTo(gapWidth, 0);
    path.lineTo(gapWidth, 30);
    path.lineTo(gapWidth - 10, 35);
    path.lineTo(10, 35);
    path.lineTo(0, 30);
    path.lineTo(0, 0);
    return path;
}

export function obst1(width) {
    let path = new Path2D();
    //linker Teil
    path.moveTo(0,0);
    path.lineTo(1/6 * width,0);
    path.lineTo(1/6 * width,30);
    path.lineTo(0,30);
    path.lineTo(0,0);


    //rechter Teil
    path.moveTo(1/6 * width + gapWidth, 0);
    path.lineTo(width, 0);
    path.lineTo(width, 30);
    path.lineTo(1/6 * width + gapWidth, 30);
    path.lineTo(1/6 * width + gapWidth, 0);
    path.closePath();
    path.closePath();
    return path;
}
export function obst1_destructable(width) {
    let path = new Path2D();
    path.moveTo(1/6 * width, 0);
    path.lineTo(1/6 * width + 10, -5);
    path.lineTo(1/6 * width + gapWidth - 10, -5);
    path.lineTo(1/6 * width + gapWidth, 0);
    path.lineTo(1/6 * width + gapWidth, 30);
    path.lineTo(1/6 * width + gapWidth - 10, 35);
    path.lineTo(1/6 * width + 10, 35);
    path.lineTo(1/6 * width, 30);
    path.lineTo(1/6 * width, 0);
    return path;
}

export function obst2(width) {
    let path = new Path2D();
    //linker Teil
    path.moveTo(0,0);
    path.lineTo(2/6 * width,0);
    path.lineTo(2/6 * width,30);
    path.lineTo(0,30);
    path.lineTo(0,0);


    //rechter Teil
    path.moveTo(2/6 * width + gapWidth, 0);
    path.lineTo(width, 0);
    path.lineTo(width, 30);
    path.lineTo(2/6 * width + gapWidth, 30);
    path.lineTo(2/6 * width + gapWidth, 0);
    path.closePath();
    path.closePath();
    return path;
}
export function obst2_destructable(width) {
    let path = new Path2D();
    path.moveTo(2/6 * width, 0);
    path.lineTo(2/6 * width + 10, -5);
    path.lineTo(2/6 * width + gapWidth - 10, -5);
    path.lineTo(2/6 * width + gapWidth, 0);
    path.lineTo(2/6 * width + gapWidth, 30);
    path.lineTo(2/6 * width + gapWidth - 10, 35);
    path.lineTo(2/6 * width + 10, 35);
    path.lineTo(2/6 * width, 30);
    path.lineTo(2/6 * width, 0);
    return path;
}

export function obst3(width) {
    let path = new Path2D();
    //linker Teil
    path.moveTo(0,0);
    path.lineTo(3/6 * width, 0);
    path.lineTo(3/6 * width, 30);
    path.lineTo(0,30);
    path.lineTo(0,0);


    //rechter Teil
    path.moveTo(3/6 * width + gapWidth, 0);
    path.lineTo(width, 0);
    path.lineTo(width, 30);
    path.lineTo(3/6 * width + gapWidth, 30);
    path.lineTo(3/6 * width + gapWidth, 0);
    path.closePath();
    path.closePath();
    return path;
}
export function obst3_destructable(width) {
    let path = new Path2D();
    path.moveTo(3/6 * width, 0);
    path.lineTo(3/6 * width + 10, -5);
    path.lineTo(3/6 * width + gapWidth - 10, -5);
    path.lineTo(3/6 * width + gapWidth, 0);
    path.lineTo(3/6 * width + gapWidth, 30);
    path.lineTo(3/6 * width + gapWidth - 10, 35);
    path.lineTo(3/6 * width + 10, 35);
    path.lineTo(3/6 * width, 30);
    path.lineTo(3/6 * width, 0);
    return path;
}

export function obst4(width) {
    let path = new Path2D();
    //linker Teil
    path.moveTo(0,0);
    path.lineTo(4/6 * width, 0);
    path.lineTo(4/6 * width, 30);
    path.lineTo(0,30);
    path.lineTo(0,0);


    //rechter Teil
    path.moveTo(4/6 * width + gapWidth, 0);
    path.lineTo(width, 0);
    path.lineTo(width, 30);
    path.lineTo(4/6 * width + gapWidth, 30);
    path.lineTo(4/6 * width + gapWidth, 0);
    path.closePath();
    path.closePath();
    return path;
}
export function obst4_destructable(width) {
    let path = new Path2D();
    path.moveTo(4/6 * width, 0);
    path.lineTo(4/6 * width + 10, -5);
    path.lineTo(4/6 * width + gapWidth - 10, -5);
    path.lineTo(4/6 * width + gapWidth, 0);
    path.lineTo(4/6 * width + gapWidth, 30);
    path.lineTo(4/6 * width + gapWidth - 10, 35);
    path.lineTo(4/6 * width + 10, 35);
    path.lineTo(4/6 * width, 30);
    path.lineTo(4/6 * width, 0);
    return path;
}

export function broken_obst_path(width) {
    let path = new Path2D();
    path.moveTo(0,0);
    path.lineTo(150, 0);
    path.lineTo(150, 30);
    path.lineTo(0, 30);
    path.lineTo(0,0);
    path.moveTo(250, 0);
    path.lineTo(width,0);
    path.lineTo(width,30);
    path.lineTo(250,30);
    path.lineTo(250,0);
    path.closePath();

    return path;
}

export function player_path(radius) {    //path for player figure
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

export function circle_path() {   //path for dot for testing
    let path = new Path2D();
    path.arc(0, 0, 5, 0, Math.PI * 2, true);
    return path;
}
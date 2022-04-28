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
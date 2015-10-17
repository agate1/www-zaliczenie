//source: http://stackoverflow.com/questions/2916081/zoom-in-on-a-point-using-scale-and-translate
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var scale = 1;
var originx = 0;
var originy = 0;
var img=document.createElement('img');
img.src='../images/windsurf7.jpg';


function draw(){	
	context.fillStyle = "gray";
    context.fillRect(originx,originy,800/scale,600/scale);
    context.fillStyle = "black";
	context.drawImage(img,0,0,800,600);
}
setInterval(draw,100);

canvas.onmousewheel = function (event){
    var mousex = event.clientX - canvas.offsetLeft;
    var mousey = event.clientY - canvas.offsetTop;
    var wheel = event.wheelDelta/120;//n or -n

    var zoom = Math.pow(1 + Math.abs(wheel)/2 , wheel > 0 ? 1 : -1);

    context.translate(
        originx,
        originy
    );
    context.scale(zoom,zoom);
    context.translate(
        -( mousex / scale + originx - mousex / ( scale * zoom ) ),
        -( mousey / scale + originy - mousey / ( scale * zoom ) )
    );

    originx = ( mousex / scale + originx - mousex / ( scale * zoom ) );
    originy = ( mousey / scale + originy - mousey / ( scale * zoom ) );
    scale *= zoom;
}



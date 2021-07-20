"use strict";
//canvas関係の変数等
const canvasS = 64
const canvasW = [canvasS*16,canvasS*12,canvasS*4];
const canvasH = [canvasS*12,canvasS*12,canvasS*12];
const canvas    = document.getElementById("main");
const context   = canvas.getContext("2d");
const vCanvas1  = document.createElement("canvas");
const vContext1 = vCanvas1.getContext("2d");
const vCanvas2  = document.createElement("canvas");
const vContext2 = vCanvas2.getContext("2d");
canvas.width    = canvasW[0];
canvas.height   = canvasH[0]; 
vCanvas1.width  = canvasW[1];
vCanvas1.height = canvasH[1]; 
vCanvas2.width  = canvasW[2];
vCanvas2.height = canvasH[2]; 

//基本処理用変数
let frame = 0;
let flag = false;

//kmeans変数
let element=[];
let group=[];
let distance=[];
const elementMax = 1000;
const groupMax = 10;
let trails = 0;

//jsにない関数をあらかじめ作る
function rand(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}
function randHex(){
    let r = rand(64,255);
    let g = rand(64,255);
    let b = rand(64,255);
    return "#"+(r*256*256+g*256+b).toString(16);
}
function minIdx(a) {
	let idx = 0;
	let value = 64*12;
	for (let i = 0; i < a.length; i++) {
		if (value > a[i]) {
			value = a[i]
			idx = i
		}
	}
	return idx
}
function line(context,fromX,fromY,toX,toY,color){
    context.beginPath();
    context.moveTo(fromX,fromY);
    context.lineTo(toX,toY)
    context.strokeStyle = color;
    context.lineWidth = 1/2;
    context.stroke();
}

//要素クラスとグループクラス
class Element{
    constructor(){
        this.x = rand(0,canvasW[1]);
        this.y = rand(0,canvasH[1]);
        this.color="#cccccc"
        this.belongs=0;
        for(let i=0;i<groupMax;i++)distance[i] = 0;
    }
    draw(){
        vContext1.fillStyle=this.color;
        vContext1.fillRect(this.x,this.y,4,4);
    }
    update(){
        for(let i=0;i<groupMax;i++){
            distance[i]=Math.sqrt((group[i].x-this.x)**2+(group[i].y-this.y)**2)
        }
        this.belongs=minIdx(distance)
        this.color=group[this.belongs].color;
    }
    drawLine(){
        if(trails!=0){
            line(vContext1,this.x+1,this.y+1,group[this.belongs].x+5,group[this.belongs].y+5,group[this.belongs].color);
        }
    }
}
class Group{
    constructor(){
        this.x = rand(0,canvasW[1]);
        this.y = rand(0,canvasH[1]);
        this.color=randHex();
        this.sumX = 0;
        this.sumY = 0;
        this.elementNum=0;
    }
    draw(){
        vContext1.fillStyle=this.color;
        vContext1.fillRect(this.x,this.y,10,10);  
    }
    update(){
        this.sumX = 0;
        this.sumY = 0;
        this.elementNum=0;
        for(let i=0;i<elementMax;i++){
            if(element[i].color==this.color){
                this.sumX+=element[i].x;
                this.sumY+=element[i].y;
                this.elementNum++;
            }
        }
        this.x=this.sumX/this.elementNum;
        this.y=this.sumY/this.elementNum;
    }
}
for(let i=0;i<elementMax;i++)element[i] = new Element();

//描画処理
function drawDebug(){
    vContext2.fillStyle = "#333333"
    vContext2.fillRect(0,0,canvasW[2],canvasH[2])
    vContext2.fillStyle = "#ffffff"
    vContext2.font = "32px monospace"
    vContext2.fillText("要素数:"+elementMax,0,32)
    vContext2.fillText("グループ数:"+groupMax,0,64)
    vContext2.fillText("試行回数:"+trails,0,96)
    if(flag){
        for(let i=0;i<groupMax;i++){
            vContext2.fillStyle = group[i].color
            vContext2.fillText("Group:"+i+":"+group[i].color,0,128+32*i);
        }
    }
}
function drawBack(){
    vContext1.fillStyle = "#111111";
    vContext1.fillRect(0,0,canvasW[1],canvasH[1]);
}
function drawElements(){
    for(let i=0;i<elementMax;i++)element[i].draw();
    for(let i=0;i<elementMax;i++)element[i].drawLine();
    if(flag){
        for(let i=0;i<groupMax;i++)group[i].draw();
    }
}
function drawAll(){
    drawBack();
    drawElements();
    context.drawImage(vCanvas1,0,0,canvasW[1],canvasH[1])
    drawDebug();
    context.drawImage(vCanvas2,canvasW[1],0,canvasW[2],canvasH[2])
}

//key処理
function keydown(event){
    if(event.keyCode == 49){
        for(let i=0;i<groupMax;i++)group[i] = new Group();
        flag=true;
    }    
    if(event.keyCode == 50){
        trails++;
        for(let i=0;i<elementMax;i++)element[i].update();
    }    
    if(event.keyCode == 51){
        for(let i=0;i<groupMax;i++)group[i].update();
    }
}

//基本処理
function loop(){
    drawAll();
    frame++;
}
function loaded(){
    setInterval(loop,10);
}
window.onload = loaded;
window.onkeydown = keydown;
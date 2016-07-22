/*定义格子类型Cell*/
function Cell(r,c){
  this.r=r;
  this.c=c;
  this.src="";
}
//定义描述旋转状态的构造函数State
function State(r0,c0,r1,c1,r2,c2,r3,c3){
	this.r0=r0;this.c0=c0;
	this.r1=r1;this.c1=c1;
	this.r2=r2;this.c2=c2;
	this.r3=r3;this.c3=c3;
}
/*抽象公共父类型Shape*/
//定义父类型构造函数Shape,定义参数src,cells
function Shape(src,cells,orgi,states){
	this.orgi=orgi//添加参照格属性
	this.states=states;//添加状态组属性
  	this.cells=cells;//初始化格子数组
	this.statei=0;//保存所有图形的当前状态的序号，创建时默认都是0	
  	for(var i=0;i<this.cells.length;i++){
    	this.cells[i].src=src
  	}
}
//在Shape类型的原型对象中，添加一个共有属性:IMGS,值为一个对象:
Shape.prototype.IMGS={
  T:"img/T.png",
  O:"img/O.png",
  I:"img/I.png",
  J:"img/J.png",
  L:"img/L.png",
  S:"img/S.png",
  Z:"img/Z.png"
}
//在Shape类型的原型对象中，添加共有方法moveDown,moveLeft,moveRight
Shape.prototype.moveDown=function(){
  for(var i=0;i<this.cells.length;i++){
    this.cells[i].r++;
  }
}
Shape.prototype.moveLeft=function(){
  for(var i=0;i<this.cells.length;i++){
    this.cells[i].c--;
  }
}
Shape.prototype.moveRight=function(){
  for(var i=0;i<this.cells.length;i++){
    this.cells[i].c++;
  }
}
Shape.prototype.rotateR=function(){//顺时针旋转一次
	this.statei++;
	this.statei==this.states.length&&(this.statei=0);
	this.rotate();
};
Shape.prototype.rotate=function(){
	var state=this.states[this.statei];
	var orgCell=this.cells[this.orgi];//获得参照格位置
	for(var i=0;i<this.cells.length;i++){//以参照格为初始位置进行移动
		if(i!=this.orgi){
			var cell=this.cells[i];
			cell.r=orgCell.r+state["r"+i];
			cell.c=orgCell.c+state["c"+i];
    	}
	}
};
Shape.prototype.rotateL=function(){//逆时针旋转一次
	this.statei--;
	this.statei==-1&&(this.statei=this.states.length-1);
	this.rotate();
};
/*定义T图形的构造函数T*/
function T(){
	Shape.call(this,
	this.IMGS.T,
	[new Cell(0,3),new Cell(0,4),
	new Cell(0,5),new Cell(1,4)],
	1,
	[new State(0,-1, 0,0, 0,+1, +1,0),//四种状态,其它格子以参照格为中进行移动
	new State(-1,0, 0,0, +1,0, 0,-1),
	new State(0,+1, 0,0, 0,-1, -1,0),
	new State(+1,0, 0,0, -1,0, 0,+1)]
 	)
}
/*T的原型继承Shape的原型*/
Object.setPrototypeOf(T.prototype,Shape.prototype);
/*定义O图形的构造函数O*/
function O(){
	Shape.call(this,
	this.IMGS.O,
	[new Cell(0,4),new Cell(0,5),
	new Cell(1,4),new Cell(1,5)],
	0,
	[new State(0,0, 0,+1, +1,0, +1,+1)]//一种状态
	)
}
/*O的原型继承Shape的原型*/
Object.setPrototypeOf(O.prototype,Shape.prototype);
function I(){
	Shape.call(this,
	this.IMGS.I,
	[new Cell(0,3),new Cell(0,4),
	new Cell(0,5),new Cell(0,6)],
	1,
	[new State(0,-1, 0,0, 0,+1, 0,+2),//两种状态
	new State(-1,0, 0,0, +1,0, +2,0)]
	)
}
/*I的原型继承Shape的原型*/
Object.setPrototypeOf(I.prototype,Shape.prototype);
function J(){
	Shape.call(this,
	this.IMGS.J,
	[new Cell(0,3),new Cell(0,4),
	new Cell(0,5),new Cell(1,5)],
	1,
	[new State(0,-1, 0,0, 0,+1, +1,+1),//四种状态
	new State(-1,0, 0,0, +1,0, +1,-1),
	new State(0,+1, 0,0, 0,-1, -1,-1),
	new State(+1,0, 0,0, -1,0, -1,1)]
	)
}
/*J的原型继承Shape的原型*/
Object.setPrototypeOf(J.prototype,Shape.prototype);
function S(){
	Shape.call(this,
	this.IMGS.S,
	[new Cell(0,4),new Cell(0,5),
	new Cell(1,3),new Cell(1,4)],
	3,
	[new State(-1,0, -1,+1, 0,-1, 0,0),//两种状态
	new State(0,+1, +1,+1, -1,0, 0,0)]
	)
}
/*S的原型继承Shape的原型*/
Object.setPrototypeOf(S.prototype,Shape.prototype);
function Z(){
	Shape.call(this,
	this.IMGS.Z,
	[new Cell(0,3),new Cell(0,4),
	new Cell(1,4),new Cell(1,5)],
	2,
	[new State(-1,-1, -1,0, 0,0, 0,+1),//两个状态
	new State(-1,+1, 0,+1, 0,0, +1,0)]
	)
}
/*Z的原型继承Shape的原型*/
Object.setPrototypeOf(Z.prototype,Shape.prototype);
function L(){
	Shape.call(this,
	this.IMGS.L,
	[new Cell(0,3),new Cell(0,4),
	new Cell(0,5),new Cell(1,3)],
	1,
	[new State(0,-1,0,0,0,+1,+1,-1),//四个状态
	new State(-1,0,0,0,+1,0,-1,-1),
	new State(0,1,0,0,0,-1,-1,+1),
	new State(+1,0,0,0,-1,0,+1,+1)]
	)
}
/*L的原型继承Shape的原型*/
Object.setPrototypeOf(L.prototype,Shape.prototype);


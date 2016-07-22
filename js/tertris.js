//JavaScript Document
var tetris={
	OFFSET:15,//保存容器的内边距
    CSIZE:26,//保存每个格子的宽高
	RN:20,//总行数
    CN:10,//总列数
	
    shape:null,//保存正在下落的主角图形
	nextShape:null,//保存下一个备胎图形
	
    interval:1000,//保存图形下落的速度
    timer:null,//保存当前动画的序号
	
    wall:null,//保存所有已经停止下落的方块的二位数组
    
	lines:0,//保存消除的总行数
	score:0,//保存当前得分	
	level:1,//保存当前游戏难度
	SCORE:[0,10,50,120,200],
	
	LN:10,//十行一级
	LNINTERVAL:100,//每升一级，interval-100毫秒
	MIN:100,//interval最小	
	
	state:1,//保存游戏状态	
	RUNNING:1,//游戏中
	PAUSE:2,//暂停
	GAMEOVER:0,//游戏结束
	
	start:function(){//启动游戏
		this.state=this.RUNNING;
		
		this.interval=1000;
		
		this.level=1;
		this.lines=0;
		this.score=0;
		this.wall=[];
		
		for(var r=0;r<this.RN;r++){
			this.wall[r]=new Array(this.CN);
		}
		this.shape=this.randomShape();
		this.nextShape=this.randomShape();
		this.paint();
    	this.timer=setInterval(this.moveDown.bind(this),this.interval);
		var me=this;//留住this
		document.onkeydown=function(e){
			switch(e.keyCode){				
				case 37://如果按键号是←，就左移 
					me.state==me.RUNNING&&(me.moveLeft()); 
					break;				
				case 39://如果按键号是→，就右移
					me.state==me.RUNNING&&(me.moveRight()); 
					break;				
				case 40://如果按键号是↓，就下落一次 
					me.state==me.RUNNING&&(me.moveDown()); 
					break;				
				case 38://如果按键号是↑，就顺时针旋转 
					me.state==me.RUNNING&&(me.rotateR()); 
					break;				
				case 90: //如果按键号是Z，就逆时针旋转
					me.state==me.RUNNING&&(me.rotateL()); 
					break;				
				case 83://如果按键号是S，就重新启动游戏 
					me.state==me.GAMEOVER&&(me.start()); 
					break;				
				case 80://如果按键号是P，就暂停游戏	
					me.state==me.RUNNING&&(me.pause());
					break;				
				case 32://如果按键号是Spance，就一落到底
					me.state==me.RUNNING&&(me.hardDrop());
					break;				
				case 67://如果按键号是C，就从暂停状态恢复运行
					me.state==me.PAUSE&&(me.myContinue());
					break;				
				case 81://如果按键号是Q，就立刻结束游戏
					me.state!=me.GAMEOVER&&(me.quit());
			}
		}
  	},
 quit:function(){
    this.state=this.GAMEOVER;//修改游戏状态为GAMEOVER
    clearInterval(this.timer);//停止定时器
    this.timer=null;
    this.paint();
  },
	hardDrop:function(){
		while(this.canDown()){
			this.moveDown();
		}
		this.paint();
	},
	gameOver:function(){
		//修改游戏的状态为GAMEOVER
		this.state=this.GAMEOVER;
		clearInterval(this.timer);//停止定时器
		this.timer=null;//清空timer
		this.paint();
	},
	myContinue:function(){//从暂停状态恢复运行状态
		this.state=this.RUNNING;
		this.paint();
	},	
	canRotate:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.r<0||cell.r>19||cell.c<0||cell.c>9||this.wall[cell.r][cell.c]!==undefined){
				return false;
      		}
	    }
    return true;
	},
	rotateR:function(){//专门负责右转一次
		this.shape.rotateR();
		!this.canRotate()?this.shape.rotateL():this.paint();
	},
	rotateL:function(){//专门负责左转一次
		this.shape.rotateL();
		!this.canRotate()?this.shape.rotateR():this.paint();
	},
	pause:function(){//暂停游戏
		this.state=this.PAUSE;
		this.paint();
	},
	canLeft:function(){//专门用于检测能否左移
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==0||this.wall[cell.r][cell.c-1]!==undefined){
				return false;
			}
		}
		return true;
	},
	moveLeft:function(){
		if(this.canLeft()){
			this.shape.moveLeft();
			this.paint();
		}		
	},
	canRight:function(){//专门用于检测能否右移
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==this.CN-1||this.wall[cell.r][cell.c+1]!==undefined){
				return false;
			}
		}
		return true;
	},
	moveRight:function(){
		if(this.canRight()){
			this.shape.moveRight();
			this.paint();
		}		
	},
	canDown:function(){//专门用于检测能否下落
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.r==this.RN-1||this.wall[cell.r+1][cell.c]!==undefined){
				return false;
			}
		}
		return true;
	 },
	paintState:function(){
		if(this.state==this.PAUSE){
			var img=new Image();
			img.src="img/pause.png";
			pg.appendChild(img);
		}else if(this.state==this.GAMEOVER){
			var img=new Image();
			img.src="img/game-over.png";
			pg.appendChild(img);
		}
	},
	 isGameover:function(){
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
			if(this.wall[cell.r][cell.c]!==undefined){
				return true;
			}
		}
		return false; 
	},
	 moveDown:function(){//负责将图形下落一次
		if(this.state==this.RUNNING){
			if(this.canDown()){
				this.shape.moveDown();
			}else{
				this.landIntoWall();
				
				var ln=this.deleteRows();
				this.lines+=ln;
				this.score+=this.SCORE[ln];
					
				if(this.lines>this.level*this.LN){
					this.level++;
					if(this.interval>this.MIN){
						this.interval-=this.LNINTERVAL;
						clearInterval(this.timer);
						this.timer=setInterval(this.moveDown.bind(this),this.interval);
					}
				}
							
				if(!this.isGameover()){
					this.shape=this.nextShape;
					this.nextShape=this.randomShape();
				}else{
					this.quit();
				}
			}
			this.paint();
		}
	 },
	paintScore:function(){
		lines.innerHTML=this.lines;
		score.innerHTML=this.score;
		level.innerHTML=this.level; 
	},
	deleteRows:function(){//检查能否消行
		for(var r=this.RN-1,ln=0;r>=0&&(this.wall[r].join("")!="");r--){
			if(this.isFull(r)){
				this.deleteRow(r);
				r++;
				ln++;
				if(ln==4){break;}
			}
		}
		return ln; 
	},
	deleteRow:function(delr){//删除r行
		 for(var r=delr;r>0;r--){
			this.wall[r]=this.wall[r-1];
			this.wall[r-1]=new Array(this.CN);
			for(var c=0;c<this.CN;c++){
				var cell=this.wall[r][c];
				cell!==undefined&&cell.r++;
			}
			if(this.wall[r-2].join("")==""){break;}
		}
	},
	isFull:function(r){//判断r行是否满格
		return String(this.wall[r]).search(/^,|,,|,$/)==-1;
	},
	 randomShape:function(){//专门随机创建一个图形
		var r=parseInt(Math.random()*7);
		switch(r){
			case 0:
				return new T();
			case 1:
				return new O();
			case 2:
				return new I();
			case 3:
				return new J();
			case 4:
				return new S();
			case 5:
				return new Z();
			case 6:
				return new L();
		}
	 },
	 landIntoWall:function(){//专门负责将主角放入wall中
	 	for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			this.wall[cell.r][cell.c]=cell;
		}
	 },
	paintWall:function(){//专门绘制墙中所有方块
		var frag=document.createDocumentFragment();
		for(var r=this.RN-1;r>=0&&(this.wall[r].join("")!="");r--){
			for(var c=0;c<this.CN;c++){
				var cell=this.wall[r][c];
				if(cell){
					var img=new Image();
					img.src=cell.src;
					img.style.top=cell.r*this.CSIZE+this.OFFSET+"px";
					img.style.left=cell.c*this.CSIZE+this.OFFSET+"px";
					frag.appendChild(img);
				}
			}
		}
    	pg.appendChild(frag);
  	},
	paint:function(){//重绘一切
    	var reg=/<img[^>]*>/g
   		pg.innerHTML=pg.innerHTML.replace(reg,"");
    	this.paintShape();//绘制主角
		this.paintNext();//绘制备胎
		this.paintWall();//绘制墙
		this.paintScore();//绘制分数
		this.paintState();//绘制状态图片
  	},
	paintShape:function(){//专门绘制主角图形
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			var img=new Image();
			img.src=cell.src;
			img.style.top=this.OFFSET+cell.r*this.CSIZE+"px";
			img.style.left=this.OFFSET+cell.c*this.CSIZE+"px";
			frag.appendChild(img);
		}
		pg.appendChild(frag);
	},
	paintNext:function(){//在右上角绘制备胎
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
			var img=new Image();
			img.src=cell.src;
			img.style.top=(cell.r+1)*this.CSIZE+this.OFFSET+"px";
			img.style.left=(cell.c+10)*this.CSIZE+this.OFFSET+"px";
			frag.appendChild(img);
		}
		pg.appendChild(frag);
	},
}
window.onload=function(){
	tetris.start();
}
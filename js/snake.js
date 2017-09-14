var
//ilosc pól w poziomie i pionie
kolumny = 35,
wiersze = 35,

//rodzaje pól
FREE = 0,
SNAKE = 1,
FRUIT = 2,

//kierunek ruchu weza
LEFT  = 0,
UP    = 1,
RIGHT = 2,
DOWN  = 3,

//kody klawiszy
LEFT_BUTTON  = 37,
UP_BUTTON    = 38,
RIGHT_BUTTON = 39,
DOWN_BUTTON  = 40,
S_BUTTON = 83, //start
P_BUTTON = 80, //cheat button
O_BUTTON = 79,

//flaga w zależności od której jest wybrane miejsce rysowania wyniku
FLAG = 1,

//co ile klatek jest wykonywane aktualizacja 
time = 5,

//rozmiar pola w siatce
ceil_size = 15,

//zmienna nie pozwalająca na zmiane kierunku weża dwukrotnie przed rysowaniem klatki
no_reverse = true,

//id w pętli animacji
requestID,

//stan animacji
state=false,

//bool użyty do obsługi menu
menubool,

//tablica klawiszy
keys,

active=0,
//canvas, kontekst, wynik i współczynnik wyniku
canvas,	  
ctx,	  
score,
best_score,
score_value;

//jesli nie ma takiego klucza to jest tworzony
if (localStorage.getItem("best_score") === null)
    localStorage.setItem("best_score",0);
    
    
//obrazy menu, obraz po śmirci węża i obraz jabłka
var img=new Image();
img.src = "images/apple.png";	 

var img_start=new Image();
img_start.src = "images/back.png";

var img_dead=new Image();
img_dead.src = "images/dead.png";


//dźwięki
var audio = new Audio('audio/beep9.mp3'); 
var audio2 = new Audio('audio/beep16.mp3'); 


//obsługa sterowania menu 
function doMouseDown(event)
{
	var x=event.clientX-canvas.offsetLeft;
	var y=event.clientY+document.body.scrollTop + document.documentElement.scrollTop-canvas.offsetTop;
	//alert("x= "+ (x) + "  y= "+ (y));
	if(x>200 & x<350 & y>200 & y<250 & menubool)
	{
		clear(ctx,"white");
		menubool=false;
		main();
		
	}
	
	if(x>170 & x<420 & y>415 & y<465 & state)
	{
		clear(ctx,"white");
		state=false;
		main();
		
	}
	
	
}


//stworzenie canvasu i inicjalizacja kontekstu
function init_canvas()
{
	canvas = document.createElement("canvas");
	canvas.width = kolumny*ceil_size;
	canvas.height = wiersze*ceil_size;
	canvas.id="c";
	canvas.tabindex="1";
	ctx = canvas.getContext("2d");
	canvas.addEventListener("mousedown",doMouseDown,false);
	document.getElementById("canvasdiv").appendChild(canvas);

}


//rysowanie menu
function menu()
{	
	menubool=true;
    handle_keys();
	
	clear(ctx,"white");
	img_start.onload = function()
	{
		ctx.drawImage(img_start,0,0,525,525,0,0,525,525);
		ctx.fillStyle = "#f00";
		//ctx.fillRect(200,200,150,50);
	}


}


//siatka reprezntująca poziom 
level = {
	width: null,  
	height: null, 
	_level: null,  

	init: function(val, col, row) 
    {
		this.width = col;
		this.height = row;
		this._level = [];
		for (var x=0; x < this.width; x++) 
        {
			this._level.push([]);
			for (var y=0; y < this.height; y++) 
            {
				this._level[x].push(val);
			}
		}
	},
	
	set: function(val, x, y) 
    {
		this._level[x][y] = val;
	},
	
	get: function(x, y) 
    {
		return this._level[x][y];
	}
};


//wąz
snake = {
	direction: null, 
	tail: null,		 
	_snake: null,	 
	
	init: function(x, y, dir) 
    {
		this.direction = dir;
		this._snake = [];
		this.insert(x, y);
	},
	
	insert: function(x, y) 
    {
		
		this._snake.unshift({x:x, y:y});
		this.tail = this._snake[0];
	},
	
	remove: function() 
    {
		
		return this._snake.pop();
	}
};

//funkcja umieszczająca jabłko w losowym miejscu planszy
function spawn_food()
{
    var los=0,
		los2=0;
	do 
	{
                
		los = Math.round(Math.random()*(kolumny-1));
		los2 = Math.round(Math.random()*(wiersze-1));
	
	}
	while (level.get(los,los2) !== FREE)
	
    level.set(FRUIT, los, los2);
    
} 

//obsługa sterowaia wężem sprowadza się do zmiacordy kierunu przemieszczania się węża po wciśnięciu klawisza
function handle_keys()
{

	
$(document).keydown(function(e)
	{
		var key = e.which;
		if(key == LEFT_BUTTON && snake.direction != RIGHT && no_reverse) 
        {
            snake.direction = LEFT;
            no_reverse = false;
        }
        else if(key == UP_BUTTON && snake.direction != DOWN && no_reverse)
        {
            snake.direction = UP;
            no_reverse = false;
        }
        else if(key == RIGHT_BUTTON && snake.direction!= LEFT && no_reverse)
        {
            snake.direction = RIGHT;
            no_reverse = false;
        }
        else if(key == DOWN_BUTTON && snake.direction != UP && no_reverse)
        {
            snake.direction = DOWN;
            no_reverse = false;
        }
        else if(key == S_BUTTON && (state || menubool))
        {
            clear(ctx,"white");
            menubool=state=false;
            main();
        }
        else if(key == P_BUTTON && !state && !menubool)
            active++;
        else if(key == O_BUTTON && !state && !menubool)
            active=0;//cheat
        //else alert(key);
        
        
	})




    
    
}



//funkcja czyszcząca kontekst dacordym kolorem
function clear(ctx, color)
{
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//funkcja główna
function main() 
{
	clear(ctx,"white");
	keys={};
	window.addEventListener("keydown",
    function(e)
    {
        keys[e.keyCode] = true;
        switch(e.keyCode)
        {
            case LEFT_BUTTON: 
            case RIGHT_BUTTON: 
            case DOWN_BUTTON:  
            case UP_BUTTON: 
                e.preventDefault(); 
                break;     
            default: break; 
        }
    },
        false);
	init();
	loop();
}


//inicjalizacja rozgrywki
function init() 
{
	score = 0;
    score_value=1;
    best_score=localStorage.getItem("best_score");
    //alert(best_score);
    
	frame = 0;
	state = false;
	ctx.font = "15px Segoe Script";
	level.init(FREE, kolumny, wiersze);
	snake.init(1,1, RIGHT);
	level.set(SNAKE, 1, 1);
	spawn_food();
}


//główna pętla
function loop() 
{
	if(!state)//animacja jest dalej rysowana
    {
		requestID=window.requestAnimationFrame(loop, canvas);
		update();
		draw();
	}
	else//animacja zatrzymana
	{
            clear(ctx,"white");

			ctx.drawImage(img_dead,0,0,525,525,0,0,525,525);
			ctx.fillStyle = "#f00";
			ctx.font = "35px Segoe Script";
			ctx.fillText(" "+ score , 200, 225);
            if(score>best_score)
            {
                best_score=score;
                localStorage.setItem("best_score",best_score);
            }
            
            ctx.fillText(" "+ best_score , 315, 275);
                
			//ctx.fillStyle = "#f00";
			//ctx.fillRect(170,415,250,50);
		
		
	}

}


//wykrywanie zderzenia z napisem wyniku oraz "jedzenie"
function collidor(cordx,cordy)
{

	
	if (cordy === wiersze -1)
		FLAG = 0;
	else if (cordy === 0)
		FLAG = 1;
		
	if (level.get(cordx, cordy) === FRUIT) 
	{
		score+=score_value;
		audio.play();
		spawn_food();
	} 
	else 
	{
		var tail = snake.remove();
		level.set(FREE, tail.x, tail.y);
	}
	
	var l=Math.floor(score/20);
    score_value=1+l;
	if(time>=3)
		time=5-l;

}


//funkcja aktualizująca
function update() {
	frame++;
	handle_keys();
	if ((frame%(time)) === 0) 
    {
        no_reverse = true;
		
		var cordx = snake.tail.x;
		var cordy = snake.tail.y;
		
		switch (snake.direction) 
		{
            case RIGHT:
				cordx++;
				break;
			case DOWN:
				cordy++;
				break;
			case LEFT:
				cordx--;
				break;
			case UP:
				cordy--;
				break;
            default: break;

		}
		if (0 > cordy || cordy > level.height-1 ||  0 > cordx || cordx > level.width-1 || level.get(cordx, cordy) === SNAKE) 
		{
			audio2.play();
			state=true;

		}
		collidor(cordx,cordy);
		

		level.set(SNAKE, cordx, cordy);
		snake.insert(cordx, cordy);
	}
}


//funkcja odpowiedzailna za rysowanie planszy 
function draw() 
{
	
	
	for (var x=0; x < level.width; x++)
	{
		for (var y=0; y < level.height; y++) 
		{
			
			switch (level.get(x, y)) 
			{
				case FREE:
					ctx.fillStyle = "white";
					ctx.fillRect(x*ceil_size, y*ceil_size, ceil_size, ceil_size);
					break;
				case SNAKE:
					ctx.fillStyle = "#0b5c00";
					ctx.fillRect(x*ceil_size, y*ceil_size, ceil_size-2, ceil_size-2);
					break;
					
				case FRUIT:
					ctx.drawImage(img,x*ceil_size, y*ceil_size);
					break;
                default:break;
			}
			
		}
	}
	
	 
   
  

	if(FLAG == 1)
	{
		ctx.fillStyle = "#f00";
		ctx.fillText("Wynik= " + score + "  Update_speed= " + time, 10, canvas.height-10);
	}
	else 
	{
		ctx.fillStyle = "#f00";
		ctx.fillText("Wynik= " + score + "  Update_speed= " + time, 10, 15);
	}
}


//start rozgrywki
//wyswietl();
init_canvas();
menu();

function checkDistance(x1,x2,y1,y2)
{
    var tmpX = x1 - x2;
    var tmpY = y1 - y2;

    return Math.sqrt(Math.pow(tmpX,2)+Math.pow(tmpY,2));
}
function setCanvasDimensions(obj){
    obj.width = window.innerWidth * 0.8;
    obj.height = window.innerHeight* 0.7; 
}
window.onload = function()
{ 
//variables
    const canvas = document.querySelector("#canvas");
    const c = canvas.getContext("2d");
//popUps
    const popUPs = document.querySelectorAll('.popUp');
    const pausePopUp = document.querySelector("#pause");
    const losePopUp = document.querySelector("#lose");
    const startPopUp = document.querySelector("#start");
    const lvlPopUp = document.querySelector("#lvl");
    const lifePopUp = document.querySelector("#life");
    const winPopUp = document.querySelector("#win");
    function showPopUp(obj){
        pause = true;
        obj.style.display = 'block';
    }
    function hidePopUp(obj){
        pause = false;
        obj.style.display = 'none';
    }
//counters
    const foodCounter = document.querySelector("#foodCounter span");
    const lvlCounter = document.querySelector("#lvlCounter");
    function showCounter(obj,counter){
        obj.innerHTML = counter;
    }
//life-hearth update
    const lifePopUpHearts = document.querySelectorAll('#life img');
    const bottomHearts = document.querySelectorAll('#bottom img');
    const heartsIcons = document.querySelectorAll('.heartIcons');
    const setHearts = ()=>{
        for(heart of heartsIcons)
            heart.setAttribute('src','./icons/full_heart_icon.svg');
    }
    function updateHearth(array){
        switch (life) {
            case 2:
                array[2].setAttribute('src','./icons/empty_heart_icon.svg');
                break;
            case 1:
                array[1].setAttribute('src','./icons/empty_heart_icon.svg');
                break;
            case 0:
                array[0].setAttribute('src','./icons/empty_heart_icon.svg');
                break;
            default:
                break;
        }
    }
//direction
    var direction;
    const setDirection = (e)=>{
        if(40 >= e.keyCode && e.keyCode >= 37)
            Math.abs(direction - e.keyCode) !== 2 ? direction = e.keyCode : false;
    }
    function getHorizontalDirection(radius){
        if(direction == 37)
            return -radius;
        else if(direction == 39)
            return radius;
        else
            return 0;
    }
    function getVerticalDirection(radius){
        if(direction == 38)
            return -radius;
        else if(direction == 40)
            return radius;
        else
            return 0;
    }
//snake
    const snakeArray =[];
    let snakeSize = 8;
    function Snake(x,y,radius){

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = '#F27E63';

        this.draw = function(){
            c.beginPath();
            c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
            c.fillStyle = this.color;
            c.strokeStyle = this.color;
            c.fill();
            c.stroke();
        }
    }
    function setSnakeHead(){
        snakeArray.length = 0;
        snakeArray.push(new Snake(canvas.width/2,canvas.height/2,snakeSize));
    }
//food
    const foodArray = [];
    let foodQuantity = 24;
    let foodSize = 8;
    function Food(x,y,radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = '#0476D9';
        
        this.draw = function(){
            c.beginPath();
            c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
            c.fillStyle = this.color;
            c.strokeStyle = this.color;
            c.fill();
            c.stroke();
        }
    }
    function setFood(){
        foodArray.length = 0;
        let radius= foodSize;
        let x = (Math.random() * (canvas.width - radius*2))+radius;
        let y = (Math.random() * (canvas.height - radius*2))+radius;

        foodArray.push(new Food(x,y,radius));
    
        for(let i=0;i<foodQuantity;i++){
            x = (Math.random() * (canvas.width - radius*2))+radius;
            y = (Math.random() * (canvas.height - radius*2))+radius;
            

            for(let j=0;j<foodArray.length;j++){
                const food = foodArray[j];
                if(checkDistance(food.x,x,food.y,y)<radius*3){
                    x = (Math.random() * (canvas.width - radius*2))+radius;
                    y = (Math.random() * (canvas.height - radius*2))+radius;
                    j=0;
                }
            }
            foodArray.push(new Food(x,y,radius));
        } 
    }
//animation
    let pause = true;
    let counter = 0;
    let life = 3;
    let speed = 8;
    const winLvl = 8;
    function animation()
    {
        requestAnimationFrame(animation);
        c.clearRect(0,0,canvas.width,canvas.height);
        showCounter(foodCounter,foodArray.length);
        showCounter(lvlCounter,10-speed);

        for(snake of snakeArray)
            snake.draw();
        for(food of foodArray)
            food.draw();

    //counter
        pause == false ? counter++ : counter = counter;
    //hearts reset
        if(life ==3 && pause == false){
            setHearts();
        }
    //playground reset
        if(foodArray.length == 0){
            setFood();
            setSnakeHead();
        }
    //lvlup & win state
        if(foodArray.length == 0 && 10-speed !== winLvl){
            showPopUp(lvlPopUp);
            life !== 1 ? speed-- : speed = 9;
        }
        else if(10-speed == winLvl && foodArray.length == 0){
            showPopUp(winPopUp);
            life = 3;
            speed = winLvl;
        }
    //move state
        if(counter == speed){
            const head = snakeArray[0];
            const headX = head.x+getHorizontalDirection(head.radius*2);
            const headY = head.y+getVerticalDirection(head.radius*2);
            const newHead = new Snake(headX,headY,snakeSize);

        //colision with tail
            for (let i = 1; i < snakeArray.length; i++) {
                const tail = snakeArray[i];
                const headTailDistance = checkDistance(tail.x,head.x,tail.y,head.y);
                if(headTailDistance < head.radius*2){
                    life--;
                    updateHearth(lifePopUpHearts);
                    updateHearth(bottomHearts);
                    if(life !== 0){
                        showPopUp(lifePopUp);
                    }
                    else{
                        showPopUp(losePopUp);
                        life = 3;
                    }
                }
            }
        //colision with walls
            if(head.x+head.radius<=0 || head.x-head.radius>=canvas.width || head.y+head.radius <= 0 || head.y-head.radius >= canvas.height){
                life--;
                updateHearth(lifePopUpHearts);
                updateHearth(bottomHearts);
                if(life !== 0){
                    showPopUp(lifePopUp);
                }
                else{
                    showPopUp(losePopUp);
                    life = 3;
                }
            }
        //eat food
            const foodArrayLength = foodArray.length;
            for (let i = 0; i < foodArray.length; i++) {
                const food = foodArray[i];
                const snakeFoodDistance = checkDistance(food.x,head.x,food.y,head.y);
                if(snakeFoodDistance<food.radius*2){
                    foodArray.splice(i,1);
                }
            }
            foodArrayLength == foodArray.length ? snakeArray.pop() : false;
            pause == false ? snakeArray.unshift(newHead) : setSnakeHead();
            counter = 0;
        }
    }
//init
    window.addEventListener('resize',()=>{
        setCanvasDimensions(canvas);
        setSnakeHead();
        setFood();
    });
    window.addEventListener('keyup',(e)=>{
        if(e.keyCode !== 32 ){
            for(popUP of popUPs)
                hidePopUp(popUP);
                hidePopUp(startPopUp);
        }
        else if(e.keyCode == 32){
            showPopUp(pausePopUp);
        }
    });
    window.addEventListener('keydown',setDirection);
    setCanvasDimensions(canvas);
    showCounter(foodCounter,foodArray.length);
    showCounter(lvlCounter,10-speed);
    setFood();
    setSnakeHead();
    showPopUp(startPopUp);
    animation();
}






























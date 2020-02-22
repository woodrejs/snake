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
    const colorsArray = [
        "#713D99",
        "#7C14CC",
        "#0400FF",
        "#FFCA40",
        "#CC8714"
    ];
//popUps
    const popUPs = document.querySelectorAll('.popUp');
    const pausePopUp = document.querySelector("#pause");
    const losePopUp = document.querySelector("#lose");
    const startPopUp = document.querySelector("#start");
    const lvlPopUp = document.querySelector("#lvl");
    const lifePopUp = document.querySelector("#life");
    function showPopUp(obj){
        pause = true;
        obj.style.display = 'block';
    }
    function hidePopUp(obj){
        pause = false;
        obj.style.display = 'none';
    }
//counters
    const foodCounter = document.querySelector("#foodCounter");
    const lifeCounter = document.querySelector("#lifeCounter");
    const lvlCounter = document.querySelector("#lvlCounter");
    function showCounter(obj,counter){
        obj.innerHTML = counter;
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
    let snakeSize = 5;
    function Snake(x,y,radius){

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = 'red';

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
    let foodQuantity = 49;
    let foodSize = 5;
    function Food(x,y,radius,color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        
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
        let color = colorsArray[Math.floor(Math.random() * colorsArray.length + 1)];

        foodArray.push(new Food(x,y,radius,color));
    
        for(let i=0;i<foodQuantity;i++){
            x = (Math.random() * (canvas.width - radius*2))+radius;
            y = (Math.random() * (canvas.height - radius*2))+radius;
            color = colorsArray[Math.floor(Math.random() * colorsArray.length + 1)];

            for(let j=0;j<foodArray.length;j++){
                const food = foodArray[j];
                if(checkDistance(food.x,x,food.y,y)<radius*3){
                    x = (Math.random() * (canvas.width - radius*2))+radius;
                    y = (Math.random() * (canvas.height - radius*2))+radius;
                    j=0;
                }
            }
            foodArray.push(new Food(x,y,radius,color));
        } 
    }
//animation
    let pause = true;
    let counter = 0;
    let life = 3;
    let speed = 9;
    function animation()
    {
        requestAnimationFrame(animation);
        c.clearRect(0,0,canvas.width,canvas.height);

        showCounter(foodCounter,foodArray.length);
        showCounter(lifeCounter,life);
        showCounter(lvlCounter,10-speed);

        for(snake of snakeArray)
            snake.draw();
        for(food of foodArray)
            food.draw();
        if(foodArray.length == 0){
            showPopUp(lvlPopUp);
            setFood();
            setSnakeHead();
            life !== 1 ? speed-- : speed = 9; 
        }
        
        if(counter == speed){
            const head = snakeArray[0];
            const headX = head.x+getHorizontalDirection(head.radius*2);
            const headY = head.y+getVerticalDirection(head.radius*2);
            const newHead = new Snake(headX,headY,snakeSize);

            for (let i = 1; i < snakeArray.length; i++) {
                const food = snakeArray[i];
                const headTailDistance = checkDistance(food.x,head.x,food.y,head.y);
                if(headTailDistance < head.radius*2){
                    setSnakeHead();
                    setFood();
                    if(life !== 1){
                        showPopUp(lifePopUp);
                        life--;
                    }
                    else{
                        showPopUp(losePopUp);
                        life = 3;
                    }
                }
            }
            for (let i = 0; i < foodArray.length; i++) {
                const food = foodArray[i];
                const snakeFoodDistance = checkDistance(food.x,head.x,food.y,head.y);
                snakeFoodDistance<food.radius*2 ? snakeArray.push(foodArray.splice(i,1)[0]) : false;
            }
            snakeArray.unshift(newHead);
            snakeArray.pop();
            counter = 0;
            if(newHead.x+newHead.radius<=0 || newHead.x-newHead.radius>=canvas.width || newHead.y+newHead.radius <= 0 || newHead.y-newHead.radius >= canvas.height){
                setSnakeHead();
                setFood();
                if(life !== 1){
                    showPopUp(lifePopUp);
                    life--;
                }
                else{
                    showPopUp(losePopUp);
                    life = 3;
                }
            }
        }
        else
            pause == false ? counter++ : counter = counter;
        
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
        }
        else if(e.keyCode == 32){
            showPopUp(pausePopUp);
        }
        else
            return;
    });
    window.addEventListener('keydown',setDirection);
    setCanvasDimensions(canvas);
    showCounter(foodCounter,foodArray.length);
    showCounter(lifeCounter,life);
    showCounter(lvlCounter,10-speed);
    setFood();
    setSnakeHead();
    showPopUp(startPopUp);
    animation();
}






























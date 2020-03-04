function checkDistance(x1,x2,y1,y2)
{
    var tmpX = x1 - x2;
    var tmpY = y1 - y2;

    return Math.sqrt(Math.pow(tmpX,2)+Math.pow(tmpY,2));
}
function setCanvasDimensions(obj){
    obj.width = parseInt(window.innerWidth * 0.8);
    obj.height = parseInt(window.innerHeight* 0.7); 
}
window.onload = function()
{ 
//canvas
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
    const bottomHearts = document.querySelectorAll('#lifeCounter img');
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
//phone controle
    const controlBtns = document.querySelectorAll('.phoneControlBtns');
    const leftBtn = document.querySelector('#leftBtn');
    const rightBtn = document.querySelector('#rightBtn');
    const downBtn = document.querySelector('#downBtn');
    const upBtn = document.querySelector('#upBtn');
    const pauseBtn = document.querySelector('#pauseBtn');
    function setDirectionOnPhone(obj){
        switch (obj) {
            case leftBtn:
                Math.abs(direction - 37) !== 2 ? direction = 37 : false;
                break;
            case rightBtn:
                Math.abs(direction - 39) !== 2 ? direction = 39 : false;
                break;
            case downBtn:
                Math.abs(direction - 40) !== 2 ? direction = 40 : false;
                break;
            case upBtn:
                Math.abs(direction - 38) !== 2 ? direction = 38 : false;
                break;
            case pauseBtn:
                direction = 32;
                break;
        }
    }
//snake
    const snakeArray =[];
    let snakeSize;
    function Snake(x,y,radius){

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.updateColor = function(){
            this == snakeArray[0] ? this.color = '#D95284' : this.color = '#F27E63';
        }
        this.draw = function(){
            this.updateColor();
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
    let foodQuantity;
    let foodSize;
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
    let speed;
    let winLvl = 5;
    let life = 3;
    let currentlvl = 0;
    if(window.innerWidth< 801){
        speed = 15;
        foodSize = 4;
        snakeSize = 4;
        foodQuantity = 2;
    }else{
        speed = 8;
        foodSize = 8;
        snakeSize = 8;
        foodQuantity = 0;
    }
    function animation()
    {
        requestAnimationFrame(animation);
        c.clearRect(0,0,canvas.width,canvas.height);
        showCounter(foodCounter,foodArray.length);
        showCounter(lvlCounter,currentlvl);

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
    //lvlup & win state
        if(foodArray.length == 0 && currentlvl !== winLvl){
            showPopUp(lvlPopUp);
            currentlvl++;
            life !== 1 ? speed-- : speed = 9;
        }
        else if(currentlvl == winLvl && foodArray.length == 0){
            showPopUp(winPopUp);
            currentlvl = 0;
            life = 3;
            speed = winLvl;
        }
    //playground reset
        if(foodArray.length == 0){
            setFood();
            setSnakeHead();
        }
    //move state
        if(counter == speed && pause !== true){
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
            if(newHead.x+newHead.radius<=0 || newHead.x-newHead.radius>=canvas.width || newHead.y-newHead.radius <= 0 || newHead.y+newHead.radius >= canvas.height){
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
    for(btn of controlBtns){
        btn.addEventListener('mousedown',function(){
            setDirectionOnPhone(this);
            if(direction !== 32 ){
                for(popUP of popUPs)
                    hidePopUp(popUP);

                    hidePopUp(startPopUp);
            }
            else if(direction == 32){
                showPopUp(pausePopUp);
            }
        });
    }
    window.addEventListener('keydown',setDirection);
    setCanvasDimensions(canvas);
    showCounter(foodCounter,foodArray.length);
    showCounter(lvlCounter,currentlvl);
    setFood();
    setSnakeHead();
    showPopUp(startPopUp);
    animation();
}





























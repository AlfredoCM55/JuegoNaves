/*Mandamos llamar el canvas que es el elemento en el que comenzamos a hacer los elememtos graficos*/
window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext("2d")
    canvas.width = 850;
    canvas.height = 500;
/* Aqui comenzamos a asignar las instrucciones de lo que hara nuestro caballo
 Decimos que al presionar flecha arriba y abajo y espacio
para disparar*/
    class InputHandler{
        constructor(game){
            this.game = game;
            window.addEventListener('keydown', e =>{
                if(( (e.key==='ArrowUp') || 
                     (e.key==='ArrowDown')
                ) && this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key);
                }else if(e.key === ' '){
                    this.game.player.shootTop() /*Con la letra "d" mostramos el espacio de cada elemento en el canvas*/
                }else if(e.key  === 'd'){
                    this.game.debug = !this.game.debug
                }
            });

            window.addEventListener("keyup",  e=> {
                if(this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key),1)
                }
                //console.log(this.game.keys);
            })
        }
    }
/*En esta clase asignamos los determinamos valores a los proyectiles que lanzara el caballo 7
El witdh y height para el tamaño del proyectil y speed para la velocidad*/
    class Projectile{
        constructor(game, x, y ){
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 9;
            this.speed = 10;
            this.markedForDeletion = false
            
        }

        update(){
            this.x += this.speed;
            if(this.x > this.game.width * 0.8){
                this.markedForDeletion = true
            }
        }/*Aqui dammos los valores del proyectil como el color y la forma*/
        draw(context){
            context.fillStyle = 'purple';
            context.fillRect(this.x,this.y,this.width,this.height);
        }
    }
/*En esta clase asignamos los valores del protagonista que es nuestro caballo
Modificamos el tamaño, el espacio dentro del canvas, la velocidad */
    class Player {
        constructor(game){
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 45;
            this.y = 100;
            this.frameX = 0;
            this.frameY = 1;
            this.speedY = 0;
            this.maxSpeed = 7; 
            this.projectiles = [];
            this.image = document.getElementById('player');
            this.maxFrame = 37;         
        }
/*Aqui se complementan los valores en que se movera hacia arriba y hacia abajo de la misma forma la velocidad */
        update(){
            if(this.game.keys.includes('ArrowUp')){
                this.speedY = -this.maxSpeed;
            }else if(this.game.keys.includes('ArrowDown')){
                this.speedY = this.maxSpeed;
            }else{
                this.speedY = 0;
            }

            this.y += this.speedY;

            this.projectiles.forEach(projectile => {
                projectile.update();
            });

            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
            if(this.frameX < this.maxFrame){
                this.frameX++;

            }else{
                this.frameX = 0;
            }
        }

        draw(context){
            //this.black = this.black?false:true
            if(this.game.debug)context.strokeRect(this.x,this.y, this.width,this.height);  
            context.drawImage(this.image,
                this.frameX*this.width,
                this.frameY*this.height,
                this.width, this.height,
                this.x,this.y,
                this.width,this.height
                )      
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });          
        }

        
/**En la funcion shoot asignamos los disparos, al dar espacio se generara un nuevo proyectil y la distancia de 
 * donde los lanzara con el x+ y y+*/
        shootTop(){
            if(this.game.ammo >0){
                this.projectiles.push(new Projectile(this.game, this.x+70, this.y+80));
                this.game.ammo--;
             }
        }
    }
/**En esta clase asignamos todos los balores de los enemigos "pirañas", desde las vidas, tamaño y velocidad */
    class Enemy{
        constructor(game){
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random()*-1.5-0.5;
            this.markedForDeletion = false;
            this.lives = 8;
            this.score = this.lives;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
        }

        update(){
            this.x += this.speedX;
            if(this.x + this.width < 0){
                this.markedForDeletion = true;
            }  
            if(this.frameX < this.maxFrame){
                this.frameX++;
            }else{
                this.frameX=0
            }
        }

        draw(context){
            if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image,
                this.frameX*this.width,
                this.frameY*this.height,
                this.width,this.height,
                 this.x, this.y,
                 this.width, this.height

                );
            context.font = '20px Helvetica';
            context.fillText(this.lives, this.x, this.y);
        }
    }
/**En esta clase se asignan todos los valores de la imagen que se mostrara dentro del canvas
 * todo el movimiento y la animacion que hara*/
    class Layer {
        constructor(game, image, speedModifier){
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }

        update(){
            if(this.x <= -this.width) this.x = 0;
             this.x -= this.game.speed*this.speedModifier;
        }

        draw(context){
            context.drawImage(this.image,this.x,this.y);
            context.drawImage(this.image,this.x + this.width, this.y);
        }

    }


    class Background{
        constructor(game){
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');
            this.layer1 = new Layer(this.game, this.image1, 0.2);
            this.layer2 = new Layer(this.game, this.image2, 0.4);
            this.layer3 = new Layer(this.game, this.image3, 1.2);
            this.layer4 = new Layer(this.game, this.image4, 1.7);

            this.layers = [this.layer1, this.layer2, this.layer3];
        }

        update(){
            this.layers.forEach(layer => layer.update());
        }

        draw(context){
            this.layers.forEach(layer => layer.draw(context));
        }
    }

    class UI{
        constructor(game){
            this.game = game;
            this.fontSize = 25;
            this.fontFamily= 'Monserrat';
            this.color = 'white'
        }
/**En esta funcion modificamos las carateristicas del contador dentro del canvas */
        draw(context){
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 4;
            context.shadowOffsetY = 2;  
            context.shadowColor = 'purple';
            context.font = this.fontSize + ' px '+this.fontFamily;
            context.fillText('Score: '+this.game.score,20,40);
            
            for(let i=0;i<this.game.ammo;i++){
                context.fillRect(20+5*i,50,3,20);
            }

            const formattedTime = (this.game.gameTime*0.001).toFixed(1);
            context.fillText('Timer: '+formattedTime, 20,100)
/** Aqui asignamos los valores que nos saldran al ganar o al perder la partida */
            if(this.game.gameOver){
                context.textAlign = 'center';
                let message1;
                let message2;
                if(this.game.score > this.game.winningScore){
                    message1 = 'Has Ganado !';/** Si ganamos la ronda saldra un mensaje  */
                    message2 = 'ERES EL MEJOR';
                }else{
                    message1 = 'PERDISTE';
                    message2 = 'CALALE DE NUEVO!'/** Si pierdes saldra otro mensaje */
                }
            
                context.font = '50px '+this.fontFamily;
                context.fillText(message1, this.game.width*0.5,this.game.height*0.5-20);

                context.font = '25px '+this.fontFamily;
                context.fillText(message2, this.game.width*0.5, this.game.height*0.5+20);

            }
            context.restore();
        }
    }

    class Angler1 extends Enemy{
        constructor(game){
            super(game);
            this.width = 228;
            this.height = 169;
            this.y = Math.random()*(this.game.height*0.9-this.height);
            this.image = document.getElementById('angler1');
            this.frameY = Math.floor(Math.random()*3);
        }
    }
    
/**En esta clase se asigna todos los valores de juego en su totalidad, todo lo que se vizualiza dentro del canvas  */
    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.background =  new Background(this);
            this.keys =  [];            
            this.ammo = 0;
            this.ammoTimer = 0;
            this.ammoInterval = 100;
            this.maxAmmo = 27;
            this.enemies= [];
            this.enemyTimer = 0;
            this.enmyInterval = 500;
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 10;
            this.gameTime= 0;
            this.timeLimit = 15000;
            this.speed = 1;
            this.debug = false;
        }

        update(deltaTime){
            if(!this.gameOver) this.gameTime += deltaTime;
            if(this.gameTime >  this.timeLimit) this.gameOver = true;
            this.background.update();
            this.background.layer4.update();
            this.player.update(deltaTime);
            if(this.ammoTimer > this.ammoInterval){
                if(this.ammo < this.maxAmmo){
                    this.ammo++;
                    this.ammoTimer = 0;
                }
            }else{
                this.ammoTimer += deltaTime
            }

            this.enemies.forEach(enemy=>{
                enemy.update();
                if( this.checkCollision( this.player, enemy)){
                    enemy.markedForDeletion = true;
                }
                this.player.projectiles.forEach(projectile => {
                    if(this.checkCollision(projectile, enemy)){
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        if( enemy.lives <= 0){
                            enemy.markedForDeletion = true;
                            if(!this.gameOver){
                                this.score += enemy.score
                            }
                            if(this.score > this.winningScore) this.gameOver = true;
                        }
                    }
                });
            });

            this.enemies = this.enemies.filter(enemy=>!enemy.markedForDeletion);

            if(this.enemyTimer > this.enmyInterval && !this.gameOver){
                this.addEnemy();
                this.enemyTimer = 0;
            }else{
                this.enemyTimer += deltaTime;
            }

        }

        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.ui.draw(context);
            this.enemies.forEach(enemy=>{
                enemy.draw(context);
            });
            this.background.layer4.draw(context);
        }

        addEnemy(){
            this.enemies.push(new Angler1(this));
        }

        checkCollision(rect1, rect2){
            return(  rect1.x < rect2.x + rect2.width 
                     && rect1.x + rect1.width > rect2.x                   
                     && rect1.y < rect2.y + rect2.height
                     && rect1.height + rect1.y > rect2.y 
                );
        }
    }

    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);        
        requestAnimationFrame(animate);
    }

    animate(0);
});



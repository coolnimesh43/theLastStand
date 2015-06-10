;(function(){
	var game=new Phaser.Game("100","100",Phaser.AUTO);
	var playState={
		preload : function(){
			game.load.image('level-1','images/level-1.jpg');
			game.load.image('ship','images/blue_craft.png');
			game.load.image('bullet','images/bullet-1.png');
			game.load.image('alien','images/alien.png');
		},
		create : function(){
			this.level=1;
			this.bulletSpeed=600;
			this.fireTime=0;
			this.fireSpacing=250;
			this.currentBullet=1;
			this.MIN_ENEMY_INTERVAL=100;
			this.NEMY_INTERVAL=1000;
			this.ENEMY_SPEED=100;
			this.SPACESHIP_VELOCITY=300;
			// this.bulletCollisonGroup=game.physics.p2.createCollisionGroup()
			game.physics.startSystem(Phaser.Physics.P2JS);
  			game.physics.p2.gravity.y = 1

  			this.bg=game.add.image(0,0,'level-1');
			this.spaceShip=game.add.sprite(game.world.centerX,game.world.centerY,'ship')
			game.world.setBounds(0,0,2560,1600);
			this.spaceShip.scale.setTo(0.3);
			game.physics.p2.enable(this.spaceShip, false);

			this.aliens=game.add.group();
			this.aliens.enableBody=true;
			game.physics.p2.enable(this.aliens,false);
			// this.aliens.physicsBodyType=Phaser.Physics.P2JS;
			this.aliens.createMultiple(50,'alien');
			this.aliens.setAll('checkWorldBounds',true);
			this.aliens.setAll('outOfBoundsKill',true);

  			this.bullets=game.add.group();
  			this.bullets.enableBody=true;
  			// this.bullets.physicsBodyType=Phaser.Physics.P2JS;+
  			game.physics.p2.enable(this.bullets,false);
  			this.bullets.createMultiple(50, 'bullet');
  			this.bullets.setAll('anchor.x',1.5);
  			this.bullets.setAll('anchor.y',1);
		    this.bullets.setAll('checkWorldBounds', false);
		    this.bullets.setAll('outOfBoundsKill', true);

			//add ship trail animation
			// this.shipTrail=game.add.emitter(this.spaceShip.x,this.spaceShip.y,100);
			// this.shipTrail.width = 10;
		 //    this.shipTrail.makeParticles('bullet');
		 //    this.shipTrail.setXSpeed(30, -30);
		 //    this.shipTrail.setYSpeed(200, 180);
		 //    this.shipTrail.setRotation(50,-50);
		 //    this.shipTrail.setAlpha(1, 0.01, 800);
		 //    this.shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
		 //    this.shipTrail.start(false, 5000, 10);

			// game.physics.enable(this.spaceShip,Phaser.Physics.ARCADE);

			this.spaceShip.body.collideWorldBounds=true;

			game.camera.follow(this.spaceShip);
			this.upKey=game.input.keyboard.addKey(Phaser.Keyboard.W);
			this.leftKey=game.input.keyboard.addKey(Phaser.Keyboard.A);
			this.rightKey=game.input.keyboard.addKey(Phaser.Keyboard.D);
			this.downKey=game.input.keyboard.addKey(Phaser.Keyboard.S);
			this.alienGenerator=game.time.events.loop(Phaser.Timer.SECOND*1.25,this.launchEnemy,this);
			this.alienGenerator.timer.start();
		},
		update : function(){
			this.spaceShip.body.velocity.x=0;
			this.spaceShip.body.velocity.y=0;
			if(this.leftKey.isDown){
				this.spaceShip.body.velocity.x=-this.SPACESHIP_VELOCITY;
			}
			if(this.rightKey.isDown){
				this.spaceShip.body.velocity.x=this.SPACESHIP_VELOCITY;
			}
			if(this.upKey.isDown){
				this.spaceShip.body.velocity.y=-this.SPACESHIP_VELOCITY;
			}
			if(this.downKey.isDown){
				this.spaceShip.body.velocity.y=this.SPACESHIP_VELOCITY;
			}
			//for spaceship() rotation
			this.rotate();

			//shoot bullets on mouse click
			if(game.input.activePointer.isDown){
				this.shootBullets();
			}
			this.updateEnemyShip();
			// this.shipTrail.x = this.spaceShip.x;
			// this.bird.angle+=2.5;
			// if(!this.bird.inWorld){
			// 	game.state.start("homeState");
			// }
			// this.game.physics.arcade.collide(this.bird,this.pipes,this.deathHandler,null,this);
		},
		render:function(){
			game.debug.cameraInfo(game.camera, 500, 32);
   			game.debug.spriteCoords(this.spaceShip, 32, 32);
		},
		deathHandler:function(){
			game.state.start("homeState");
		},
		rotate:function(){
			this.spaceShip.body.rotation = game.physics.arcade.angleToPointer(this.spaceShip)+Math.PI/2;
		},
		launchEnemy:function(){
			var enemy=this.aliens.getFirstExists(false);
			if(enemy){
				enemy.scale.setTo(0.05);
				enemy.reset(game.rnd.integerInRange(0,game.width),game.rnd.integerInRange(0,game.height));
				enemy.angle=this.spaceShip.angle;
				var enemyPoint=new Phaser.Point(enemy.x,enemy.y);
				var enemyShipAngle=Phaser.Point.angle(enemyPoint,this.getShipPoint());
				enemy.body.velocity.x=-this.ENEMY_SPEED*Math.cos(enemyShipAngle);
				enemy.body.velocity.y=-this.ENEMY_SPEED*Math.sin(enemyShipAngle);
			}
		},
		shootBullets:function(){
			if(game.time.now>this.fireTime){
				var bullet=this.bullets.getFirstExists(false);
				if(bullet){
					// var bulletOffSetX=this.spaceShip.width/2*Math.cos(this.spaceShip.angle);
					// var bulletoffSetY=this.spaceShip.height/2*Math.sin(this.spaceShip.angle);
					// console.log(shipAngle,bulletOffSetX,bulletoffSetY);
					var mouseX = Math.round(game.input.activePointer.screenX)
	      			var mouseY= Math.round(game.input.activePointer.screenY);
	      			// console.log(mouseX,mouseY);
	      			// console.log(this.spaceShip.x,this.spaceShip.y)
	      			var mousePoint=new Phaser.Point(mouseX,mouseY);
	      			var mouseShipAngle=Phaser.Point.angle(mousePoint,this.getShipPoint());
	      			// console.log(mousePoint,shipPoint);
	      			// console.log("angle is "+this.getShipPoint());
					bullet.scale.setTo(0.1);
					// bullet.reset(this.spaceShip.x+bulletOffSetX,this.spaceShip.y+bulletoffSetY);
					bullet.reset(this.spaceShip.x,this.spaceShip.y);
					bullet.angle=this.spaceShip.angle+90;
					// bullet.rotation=this.spaceShip.rotation;
					// bullet.body.velocity.x = Math.cos(bullet.angle) * this.bulletSpeed;
    	// 			bullet.body.velocity.y = Math.sin(bullet.angle) * this.bulletSpeed;
					// bullet.body.velocity.y=this.spaceShip.body.velocity.y*fireDirection;
					bullet.body.velocity.x=this.bulletSpeed*Math.cos(mouseShipAngle);
					bullet.body.velocity.y=this.bulletSpeed*Math.sin(mouseShipAngle);
					// game.physics.arcade.velocityFromRotation(this.spaceShip.rotation, 400);
					this.fireTime=game.time.now+this.fireSpacing;
					// console.log(bullet.angle+90,game.math.radToDeg(this.spaceShip.body.rotation));
				}
			}
		},
		updateEnemyShip:function(){
				this.aliens.forEachAlive(function(enemy){
				var enemyPoint=new Phaser.Point(enemy.x,enemy.y);
				var enemyShipAngle=Phaser.Point.angle(enemyPoint,this.getShipPoint());
				enemy.angle=enemyShipAngle;
				enemy.body.velocity.x=-this.ENEMY_SPEED*Math.cos(enemyShipAngle);
				enemy.body.velocity.y=-this.ENEMY_SPEED*Math.sin(enemyShipAngle);
			},this);
		},
		getShipPoint:function(){
  			var shipPoint=new Phaser.Point(this.spaceShip.x,this.spaceShip.y);
  			return shipPoint;
		},

	};
	var homeState={
		preload : function(){
			game.load.image('start','images/space.jpg');
			game.load.image('gameTitle','images/game_title.png')
			game.load.image('spaceCraft','images/blue_craft.png')
		},
		create : function(){
			// game.stage.backgroundColor='#cccccc';
			this.bg=game.add.image(game.world.centerX, game.world.centerY,'start');
			this.bg.anchor.setTo(0.5);
			game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
			this.gameTitle=game.add.image(game.world.centerX-550,game.world.centerY-200,'gameTitle')
			var playBtn=game.add.image(game.world.centerX,game.world.centerY,'spaceCraft');
			playBtn.scale.setTo(0.5)
			playBtn.anchor.setTo(0.5,0.2);
			playBtn.inputEnabled=true;
			playBtn.input.useHandCursor=true;
			var playText=game.add.text(-140,350,"Click here to play",{font:"40px Arial",fill:"#8e99d8"})
			playBtn.addChild(playText)
			playBtn.events.onInputDown.add(function(){
				game.state.add('playState',playState);
				game.state.start('playState');
			},this);
		},
		update : function(){
		},

	};
	game.state.add("homeState",homeState);
	game.state.start("homeState");
})();
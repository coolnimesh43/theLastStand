;(function(){
	var game=new Phaser.Game("100","100",Phaser.AUTO);
	var playState={
		preload : function(){
			game.load.image('level-1','images/level-1.jpg');
			game.load.image('ship','images/blue_craft.png');
			game.load.image('bullet','images/bullet-1.png')
		},
		create : function(){
			this.level=1;
			this.bulletSpeed=100;
			this.fireTime=0;
			this.fireRate=10;
			this.currentBullet=1;
			// this.bulletCollisonGroup=game.physics.p2.createCollisionGroup()
			game.physics.startSystem(Phaser.Physics.P2JS);
  			game.physics.p2.gravity.y = 1

  			this.bullets=game.add.group();
  			this.bullets.enableBody=true;
  			this.bullets.physicsBodyType=Phaser.Physics.P2JS;
  			this.bullets.createMultiple(50, 'bullet');
		    this.bullets.setAll('checkWorldBounds', true);
		    this.bullets.setAll('outOfBoundsKill', true);

			this.bg=game.add.image(0,0,'level-1');
			this.spaceShip=game.add.sprite(game.world.centerX,game.world.centerY,'ship')
			game.world.setBounds(0,0,2560,1600);
			this.spaceShip.scale.setTo(0.3);
			game.physics.p2.enable(this.spaceShip, false);

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


			// this.bg.autoScroll(-150,0);
			// this.bird=game.add.sprite(game.world.centerX,game.world.centerY,'bird');
			// this.bird.anchor.setTo(0.5,0.5);
			// this.bird.scale.setTo(0.5,0.5);
			// game.physics.startSystem(Phaser.Physics.ARCADE);
			// game.physics.arcade.enable(this.bird);
			// this.bird.body.gravity.y=250;
			// var space=game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			// space.onDown.add(this.jump,this);
			// this.makePipes();
		},
		update : function(){

			this.spaceShip.body.velocity.x=0;
			this.spaceShip.body.velocity.y=0;
			if(this.leftKey.isDown){
				this.spaceShip.body.velocity.x=-250;
			}
			if(this.rightKey.isDown){
				this.spaceShip.body.velocity.x=250;
			}
			if(this.upKey.isDown){
				this.spaceShip.body.velocity.y=-250;
			}
			if(this.downKey.isDown){
				this.spaceShip.body.velocity.y=250;
			}

			//shoot bullets on mouse click
			if(game.input.activePointer.isDown){
				this.shootBullets();
			}
			//for spaceship rotation
			this.rotate();
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
		shootBullets:function(){
			// if(game.time.now > this.fireTime){
			// 	var one = this.bullets.create(this.spaceShip.body.x,this.spaceShip.body.y,'bullet')
   //                  one.reset(this.spaceShip.x, this.spaceShip.y);
   //                  game.physics.p2.enable(one);
   //                  one.lifespan = 3000;
   //                  one.body.rotation = this.spaceShip.body.rotation;
   //                  one.rotation = this.spaceShip.rotation - Phaser.Math.degToRad(90);
   //                  one.body.velocity.x = Math.cos(one.rotation) * this.bulletSpeed + this.spaceShip.body.velocity.x;
   //                  one.body.velocity.y = Math.sin(one.rotation) * this.bulletSpeed + this.spaceShip.body.velocity.y;
   //                  this.fireTime+=this.fireRate;

			// }
			var bullet=this.bullets.getFirstExists(false);
			console.log(bullet)
			bullet.scale.setTo(0.1);
			// bullet.body.rotation = this.spaceShip.body.rotation;
			bullet.rotation=this.spaceShip.rotation-Phaser.Math.degToRad(90);
			bullet.body.collideWorldBounds=false;
			game.physics.p2.enable(bullet,false);
			bullet.body.velocity.x=Math.cos(bullet.rotation) * this.bulletSpeed + this.spaceShip.body.velocity.x;
			bullet.body.velocity.y=Math.sin(bullet.rotation) * this.bulletSpeed + this.spaceShip.body.velocity.y;

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
			// this.bg.anchor.setTo(0.5,0.5);
			// this.bg.scale.setTo(1,1);
			// this.bg.autoScroll(0,50);
			// game.add.tween(this.bg).to({angle:360},200000,Phaser.Easing.Linear.None,true,0,-1);
			// this.bg=game.add.tileSprite(0,0,600,512,'bg');
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
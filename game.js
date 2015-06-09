;(function(){
	var game=new Phaser.Game("100","100",Phaser.AUTO);
	var playState={
		preload : function(){
			game.load.image('level-1','images/level-1.jpg');
			game.load.image('ship','images/blue_craft.png');
		},
		create : function(){

			game.physics.startSystem(Phaser.Physics.P2JS);
  			game.physics.p2.gravity.y = 1

			this.bg=game.add.image(0,0,'level-1');
			this.spaceShip=game.add.sprite(game.world.centerX,game.world.centerY,'ship')
			game.world.setBounds(0,0,2560,1600);
			this.spaceShip.scale.setTo(0.3);

			game.physics.p2.enable(this.spaceShip, false);
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
			//for spaceship rotation
			this.rotate();

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
		jump:function(){
			this.bird.body.velocity.y=-150;
			game.add.tween(this.bird).to({angle:-40},100).start();
		},
		makePipes:function(){
			this.pipesGenerator=game.time.events.loop(Phaser.Timer.SECOND*1.25,this.makePipe,this);
			this.pipesGenerator.timer.start();
			this.pipes=game.add.group();
		},
		makePipe:function(){
			var pipeY=game.rnd.integerInRange(-100,100);
			var pipeX=game.width;
			var pipe2Position = pipeY + 430;
			var pipe1=game.add.sprite(pipeX,pipe2Position,"pipes",0);
			var pipe2=game.add.sprite(pipeX,pipeY,"pipes",1);
			game.physics.arcade.enable(pipe1);
			game.physics.arcade.enable(pipe2);
			this.pipes.add(pipe1);
			this.pipes.add(pipe2);

			this.pipes.setAll('body.velocity.x',-200);
		},
		deathHandler:function(){
			game.state.start("homeState");
		},
		rotate:function(){
			this.spaceShip.body.rotation = game.physics.arcade.angleToPointer(this.spaceShip)+Math.PI/2;
		}

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
/*
*
*  Julgodis 2014
*  ingame.js
*
*/

var InGame = function (game) { };
InGame.prototype = 
{
	// Not needed, everything is already loaded!
	//preload: function() {} 

	sky: null,
	darksky: null,
	background1: null,
	background2: null,
	background3: null,
	ground: null,
	fpsText: null,
	infoTextGroup: null,
	deadParticles: null,
	explosions: null,

	gui_base: null,
	gui_buttons_rects: null,
	gui_buttons_overs: null,
	gui_buttons_icons: null,
	gui_buttons_costs: null,
	gui_buttons_cooldowns: null,

	gui_gold_text: null,

	trees: null,
	clouds: null,
	castle1: null,
	castle2: null,
	units: null,
	player_units: null,
	enemy_units: null,
	map: { x: 0, vx: 0 },
	units_layer: null,

	gameover: false,
	extimer: 0,
	excount: 10,
	expos: null,
	cleanup: false,

	menu: true,
	preview: -1,
	create: function()
	{
		game.extra.ingame = this;
		game.extra.length = 800*2;
		game.world.setBounds(0, 0, game.extra.length, 600);

		/* SKY */

		this.darksky = game.add.sprite(0, game.height, 'dark_sky');
		this.darksky.smoothed = false;
		this.darksky.anchor.setTo(0, 1);

		this.sky = game.add.sprite(0, game.height, 'sky');
		this.sky.smoothed = false;
		this.sky.anchor.setTo(0, 1);


		game.extra.world = game.add.group();
		this.map.x = game.extra.length-game.width;


		/* Add background */

		this.background1 = game.add.sprite(0, game.height+4*game.extra.scale, 'background1', null, game.extra.world);
		this.background1.smoothed = false;
		this.background1.anchor.setTo(0, 1);
		this.background1.scale.setTo(game.extra.scale*1.2*0.8, game.extra.scale*0.8);

		// this add a parallel effect to the background
		this.background1.base = {};
		this.background1.base.x = this.background1.x;
		this.background1.base.y = this.background1.y;
		this.background1.base.parallel = 0.1;

		this.background2 = game.add.sprite(0, game.height+4*game.extra.scale, 'background2', null, game.extra.world);
		this.background2.smoothed = false;
		this.background2.anchor.setTo(0, 1);
		this.background2.scale.setTo(game.extra.scale*1.2*0.8, game.extra.scale*0.8);

		// this add a parallel effect to the background
		this.background2.base = {};
		this.background2.base.x = this.background1.x;
		this.background2.base.y = this.background1.y;
		this.background2.base.parallel = 0.2;


		this.background3 = game.add.sprite(0, game.height+4*game.extra.scale, 'background3', null, game.extra.world);
		this.background3.smoothed = false;
		this.background3.anchor.setTo(0, 1);
		this.background3.scale.setTo(game.extra.scale*1.2*0.8, game.extra.scale*0.8);

		// this add a parallel effect to the background
		this.background3.base = {};
		this.background3.base.x = this.background1.x;
		this.background3.base.y = this.background1.y;
		this.background3.base.parallel = 0.3;



		/* Add Trees */

		this.trees = new Array();
		for(var i = 0; i < game.extra.treeCount; i++)
		{
			var x, y, overflow = 0;

			while(true)
			{
				x = game.rnd.integerInRange(100, game.extra.length-100);
				y = game.height - (8*game.extra.scale);

				var redo = false;
				for(var j = 0; j < this.trees.length; j++)
				{
					if(Math.abs(this.trees[j].sprite.base.x - x) <= 10)
					{
						redo = true;
						break;
					}

				}
				overflow++;
				if(overflow > 100)
					break;
				if(redo) continue;
				if(((x/1000)^4)/4.1 <= game.rnd.frac())
					continue;
				break;
			}

			if(overflow > 100) continue;

			var ttype = 0;
			if (x < game.rnd.integerInRange(game.extra.length/2-300, game.extra.length/2+100))
				ttype = 1;

			var tree = new Tree();

			var dscale = ((game.extra.treeCount-i-1.0)/(game.extra.treeCount));
				dscale = Math.max(0.1, Math.min(dscale + (game.rnd.normal()*0.2-0.1), 1));

			tree.init(x, y, game.extra.scale - ((game.extra.treeCount-i-1.0)/(game.extra.treeCount))*6 - 1.0, ttype);
			this.trees.push(tree);
		}

		/* Add ground */

		this.ground = game.add.sprite(0, game.height, 'ground', null, game.extra.world);
		this.ground.smoothed = false;
		this.ground.anchor.setTo(0, 1);
		this.ground.scale.setTo(game.extra.scale, game.extra.scale);
		
		this.ground.base = {};
		this.ground.base.x = this.ground.x;
		this.ground.base.y = this.ground.y;
		this.ground.base.parallel = 1.0;


		this.castle1 = new Castle();
		this.castle1.player = 1; // 1 is Player
		this.castle1.init();

		this.castle2 = new Castle();
		this.castle2.player = 0; // 0 is Computer
		this.castle2.init();

		/* Add Units */
		this.units = new Array();
		this.player_units = new Array();
		this.enemy_units = new Array();

		this.units_layer = game.add.group(game.extra.world);
		/*for(var i = 0; i < 10; i++)
		{
			if(game.rnd.frac() <= 0.5)
			{
				var u1 = new UnitTest(0, -64 - 150*i, game.height-256, game);
				this.units.push(u1);
				this.enemy_units.push(u1);
			}
			else {if(game.rnd.frac() <= 0.5)
			{
				var u1 = new UnitTest2(0, -64 - 150*i, game.height-256, game);
				this.units.push(u1);
				this.enemy_units.push(u1);
			} else 
			{
				var u1 = new UnitTest3(0, -64 - 150*i, game.height-256, game);
				this.units.push(u1);
				this.enemy_units.push(u1);
			}}
		}*/
/*
		for(var i = 0; i < 10; i++)
		{
			if(game.rnd.frac() <= 0.5)
			{
				var u1 = new UnitTest2(1, 100-550*i, 0, game);
				this.units.push(u1);
				this.player_units.push(u1);
			}
			else 
			{
				var u1 = new UnitTest3(1, 100-550*i, 0, game);
				this.units.push(u1);
				this.player_units.push(u1);
			}
		}*/

    	this.deadParticles = new Array();

    	/* CLOUDS */

    	this.clouds = new Array();
		for(var i = 0; i < game.extra.cloudCount; i++)
		{
			var x, y, overflow = 0;

			while(true)
			{
				x = game.rnd.integerInRange(-100, game.extra.length+100);
				y = game.rnd.integerInRange(-32, 100);

				var redo = false;
				for(var j = 0; j < this.clouds.length; j++)
				{
					if(Math.abs(this.clouds[j].sprite.base.x - x) <= 64)
					{
						redo = true;
						break;
					}

				}
				overflow++;
				if(overflow > 100)
					break;
				if(redo) continue;
				if(((x/1000)^4)/4.1 <= game.rnd.frac())
					continue;
				break;
			}

			if(overflow > 100) continue;

			var cloud = new Cloud();

			cloud.init(x, y, game.extra.scale - 4 + 8*((i)/(game.extra.cloudCount)), game.rnd.normal(), (game.extra.cloudCount-i-1.0)/(game.extra.cloudCount));
			this.clouds.push(cloud);
		}


		this.explosions = game.add.group(game.extra.world);

		/* GUI */

		game.time.advancedTiming = true;
    	this.fpsText = game.add.bitmapText(20, 20, 'pixel_font', 'FPS', 20);
    	this.fpsText.fixedToCamera = true;

    	this.infoTextGroup = game.add.group();

		this.gui_base = game.add.game.add.sprite(game.width, 0, 'gui_main_base', null, game.extra.world);
		this.gui_base.smoothed = false;
		this.gui_base.anchor.setTo(1, 0);
		this.gui_base.scale.setTo(game.extra.scale/1.4, game.extra.scale/1.4);

		this.gui_gold_text = game.add.bitmapText(game.width - 110, 20, 'pixel_font_gold', game.score.gold+"", 20);
		this.gui_gold_text_u = game.add.bitmapText(game.width - 120, 45, 'pixel_font_gold', "GOLD", 20);

		this.gui_base.visible = false;
		this.gui_gold_text.visible = false;
		this.gui_gold_text_u.visible = false;

		this.gui_buttons_icons = new Array();
		this.gui_buttons_costs = new Array();
		this.gui_buttons_rects = new Array();
		this.gui_buttons_rovers = new Array();
		this.gui_buttons_overs = new Array();
		this.gui_buttons_cooldowns = new Array();
		for(var i = 0; i < 4; i++)
		{
			var t = game.add.sprite(game.width - 80*(game.extra.scale/1.4) + (11 + 14.2*i)*(game.extra.scale/1.4), 3.5*(game.extra.scale/1.4), 'unit'+(i+1), null, game.extra.world);
			t.smoothed = false;
			t.visible = false;
			t.anchor.setTo(1, 0);
			t.scale.setTo((game.extra.scale/3.5) * (i==3?0.5:1), (game.extra.scale/3.5) * (i==3?0.5:1));
			this.gui_buttons_icons[i] = t;
			
			

			var c = game.add.bitmapText(game.width - 80*(game.extra.scale/1.4) + (11 + 14.0*i)*(game.extra.scale/1.4) - (11*8)/3 - 14, 82, 'pixel_font_gold', ""+costs[i] , 12);
			c.visible = false;
			this.gui_buttons_costs[i] = c;

			var x = game.width - (78-(11+3)*i)*(game.extra.scale/1.4);
			var y = (2)*(game.extra.scale/1.4);
			var w = (11)*(game.extra.scale/1.4);
			var h = (16)*(game.extra.scale/1.4);
			var r = { x: x, y: y, width: w, height: h };
			this.gui_buttons_rects[i] = r;


			var o2 = game.add.sprite(x+(game.extra.scale/1.4), y+(game.extra.scale/1.4)-0.1, 'red');
			o2.alpha = 0.3;
			o2.visible = false;
			o2.scale.setTo((game.extra.scale/1.4)*9, (game.extra.scale/1.4)*14);
			this.gui_buttons_rovers[i] = o2;

			var o = game.add.sprite(x+(game.extra.scale/1.4), y+(game.extra.scale/1.4)-0.1, 'gui_overbutton');
			o.alpha = 0.3;
			o.visible = false;
			o.scale.setTo(game.extra.scale/1.4, game.extra.scale/1.4);
			this.gui_buttons_overs[i] = o;

			this.gui_buttons_cooldowns[i] = { on: false, time: 2000, current: 0 };
		}

		this.scope = game.add.sprite(0, 0, 'scope');
		this.scope.alpha = 0;
/*
		this.gameover = true;
		this.expos = this.castle2;
		this.loser = 0;*/

		/* MENU */
		this.guimenu = game.add.sprite(game.width/2, game.height/2, 'gui_menu');
		this.guimenu.anchor.setTo(0.5, 0.5);
		this.guimenu.smoothed = false;
		this.guimenu.scale.setTo(game.extra.scale, game.extra.scale);

		var x = game.width/2 - 30*(game.extra.scale) + 20;
		var y = game.height/2 - 21*(game.extra.scale) + 32;
		this.guimenu.text1 = game.add.bitmapText(x, y, 'pixel_font_gold', 'Hello world!', 22);
		this.guimenu.text2 = game.add.bitmapText(x, y+32+4, 'pixel_font', 'This world has been invaded', 11);
		this.guimenu.text3 = game.add.bitmapText(x, y+48+4, 'pixel_font', 'by world connecters!', 11);
		this.guimenu.text4 = game.add.bitmapText(x, y+64+2+4, 'pixel_font', 'World Connecters search different', 11);
		this.guimenu.text5 = game.add.bitmapText(x, y+80+4+4, 'pixel_font', 'worlds and connect them with their', 11);
		this.guimenu.text6 = game.add.bitmapText(x, y+96+6+4, 'pixel_font', 'own home world. The only way to ', 10);
		this.guimenu.text7 = game.add.bitmapText(x, y+112+7+4, 'pixel_font', 'survive and save this world,', 10);
		this.guimenu.text8 = game.add.bitmapText(x, y+128+8+4, 'pixel_font', 'is to fight back!', 10);


		this.guimenu.buttontext1 = game.add.bitmapText(game.width/2 - 4*(game.extra.scale), game.height/2 - 21*(game.extra.scale) + 35*(game.extra.scale), 'pixel_font', 'Play', 15);

		this.guimenu.rects = new Array();
		this.guimenu.overs = new Array();
		this.guimenu.clicks = new Array();
		this.guimenu.buttons = new Array();

		var x = game.width/2 - (30)*(game.extra.scale) + 5*game.extra.scale;
		var y = game.height/2 - (21)*(game.extra.scale) + 32*game.extra.scale;
		var w = (50)*(game.extra.scale);
		var h = (6)*(game.extra.scale);
		var r = { x: x, y: y, width: w, height: h };
		this.guimenu.rects[0] = r;

		var o2 = game.add.sprite(x, y+(game.extra.scale)-0.1, 'gui_overbutton');
		o2.alpha = 0.3;
		o2.visible = false;
		o2.scale.setTo((game.extra.scale)*(50/9), (game.extra.scale)*(6/14));
		this.guimenu.overs[0] = o2;


		this.guimenu.clicks[0] = function() 
		{ 
			game.extra.ingame.menu = false; 
			 game.extra.ingame.preview = 0; 
			 game.extra.ingame.guimenu.visible = false;
			 game.extra.ingame.guimenu.text1.visible = false;
			 game.extra.ingame.guimenu.text2.visible = false;
			 game.extra.ingame.guimenu.text3.visible = false;
			 game.extra.ingame.guimenu.text4.visible = false;
			 game.extra.ingame.guimenu.text5.visible = false;
			 game.extra.ingame.guimenu.text6.visible = false;
			 game.extra.ingame.guimenu.text7.visible = false;
			 game.extra.ingame.guimenu.text8.visible = false;

		 	 game.extra.ingame.guimenu.overs[0].visible = false;
			 game.extra.ingame.guimenu.buttontext1.visible = false;


		};

		this.guimenu.buttons[0] = true;

		this.click = game.add.audio('click');
		this.click.volume = 0.5;

		this.bow = game.add.audio('bow');
		this.bow.volume = 0.5;

		this.sexplode = game.add.audio('explode');
		this.sexplode.volume = 0.3;

		this.hit = game.add.audio('hit');
		this.hit.volume = 0.5;

		this.hurt = game.add.audio('hurt');
		this.hurt.volume = 0.5;

		this.gold = game.add.audio('gold');
		this.gold.volume = 0.5;

		this.enemy = new EnemyAI();
		this.enemy.init();
	},
	shutdown: function()
	{
		
	},
	update: function()
	{
		game.extra.world.forEachAlive(this.updateObjectPosition, this);
		for(var i = 0; i < this.clouds.length; i++) this.clouds[i].update();
		for (var i = 0; i < this.deadParticles.length; i++) {
		    var a = this.deadParticles[i];
		    if(game.time.now > a.timeout)
			{
				if (a.group)
				{
				   a.group.remove(a);
				}
				else if (a.parent)
				{
					a.parent.removeChild(a);
				}

				a.removeAll();
				a = null;
				this.deadParticles.splice(i--, 1);
			}
		}

		if(this.menu)
		{
			var mx = game.input.x;
			var my = game.input.y;


			for(var i = 0; i < 1; i++)
			{
				var r = this.guimenu.rects[i];

				this.guimenu.overs[i].visible = false;
				if(mx >= r.x && mx <= r.x+r.width) {
					if(my >= r.y && my <= r.y+r.height)
					{
						this.guimenu.overs[i].visible = true;

						if(game.input.activePointer.isDown && this.guimenu.buttons[i])
						{
							this.click.play();
							this.guimenu.clicks[i]();
							this.guimenu.buttons[i] = false;
						}
					}
				}

			}

			return;
		}

		if(this.preview != -1)
		{
			if(this.preview == 0)
				this.map.x -= 1.4*(game.time.elapsed/8);
			else if(this.preview >= 20)
				this.map.x += 1.4*(game.time.elapsed/8);

			if(this.map.vx > 18) this.map.vx = 18;
			if(this.map.vx < -18) this.map.vx = -18;

			this.map.x += this.map.vx*game.time.elapsed;
			if(this.map.x <= 0) 
			{
				this.map.x = 0;
				this.map.vx = 0;
				this.preview++;
			}
			if(this.map.x+game.width > game.extra.length) 
		    {
			 	this.map.x = game.extra.length-game.width;
			 	this.preview = -1;

	 			var goldText = game.add.bitmapText(game.width/2-10, game.height/2, 'pixel_font', 'Start!', 22);
				var tween = game.add.tween(goldText);
				tween.to({ alpha: 0.0, y: game.height/2 - 100 }, 3000);
				tween.onComplete.add(function() { 
					goldText.destroy();
		            tween.onComplete.removeAll();
		            tween.stop();
		            tween = null;
				});
				tween.start();

				this.gui_base.visible = true;
				this.gui_gold_text.visible = true;
				this.gui_gold_text_u.visible = true;

				for(var i = 0; i < 4; i++)
				{
					this.gui_buttons_icons[i].visible = true;
					this.gui_buttons_costs[i].visible = true;
					
				}
			}
			this.map.vx *= 0.98;

			return;

		}

		if(this.gameover && !this.show)
		{
			if(this.excount >= 0 && game.time.now >= this.extimer)
			{
				this.explode(this.expos);
				this.excount--;
				this.extimer = game.time.now + 50;

				if(this.excount < 0)
					this.expos.kill();
			}
			else if(this.excount < 0)
			{
				if(this.loser == 1)
				{
					if(this.map.x <= 0)
					{
						this.showLose();

					}
					else this.map.vx -= 0.2*game.time.elapsed;
				}
				else 
				{
					if(this.map.x+game.width >= game.extra.length)
					{
						this.showWin();

					}
					else this.map.vx += 0.2*game.time.elapsed;
				}
			}

			if(!this.cleanup)
			{
				this.gui_base.kill();
				this.gui_gold_text.visible = false;
				this.gui_gold_text_u.visible = false;

				for(var i = 0; i < this.gui_buttons_rects.length; i++)
				{
					//this.gui_buttons_rects[i].kill();
					//this.gui_buttons_cooldowns[i].kill();
					this.gui_buttons_costs[i].visible = false;
					this.gui_buttons_overs[i].kill();
					this.gui_buttons_icons[i].kill();
					this.gui_buttons_rovers[i].kill();
				}

				this.units.forEach(function (unit)
				{
					if(unit.isDead()) return;
					this.createExplosion(unit.sprite.base.x, unit.sprite.base.y, 0.3);
					unit.kill();
				}, this);
				this.cleanup = true;
			}
		}
		else if(this.show)
		{

			var mx = game.input.x;
			var my = game.input.y;


			for(var i = 0; i < 2; i++)
			{
				var r = this.winlose.rects[i];

				this.winlose.overs[i].visible = false;

				//console.log("X: " + mx + " > " + r.x + " && " + mx + " < " + (r.x+r.width));
				if(mx >= r.x && mx <= r.x+r.width) {
				//console.log("Y: " + my + " > " + r.y + " && " + my + " < " + (r.y+r.height));

					if(my >= r.y && my <= r.y+r.height)
					{
						//console.log("over");
						this.winlose.overs[i].visible = true;

						if(game.input.activePointer.isDown && this.winlose.buttons[i])
						{
							this.click.play();
							this.winlose.clicks[i]();
							this.winlose.buttons[i] = false;
						}
					}
				}

			}

		}
		else
			this.gui_gold_text.setText(""+game.score.gold);

		var mx = game.input.x;
		var my = game.input.y;

		if (this.game.time.fps !== 0) {
		    this.fpsText.setText(this.game.time.fps + ' FPS');
		}	

		if(!this.gameover)
		{
			if(my > 150)
			{
				if(mx <= 200)
					this.map.vx -= (0.015 + ((200-mx)*(200-mx))/3200000)*game.time.elapsed;
				else if(mx >= game.width-200)
					this.map.vx += (0.015 + ((mx-game.width-200)*(mx-game.width-200))/3200000)*game.time.elapsed;
			}
		}

		if(this.map.vx > 18) this.map.vx = 18;
		if(this.map.vx < -18) this.map.vx = -18;

		this.map.x += this.map.vx*(game.time.elapsed/16);
		if(this.map.x < 0) this.map.x = 0;
		if(this.map.x+game.width > game.extra.length) this.map.x = game.extra.length-game.width;
		this.map.vx *= 0.98;

		if(!this.gameover)
		{
			this.enemy.update();
			if(game.time.now >= game.score.goldPP)
			{
				game.score.gold++;
				game.score.total++;
				game.score.goldPP = game.time.now + 100;
			}


			this.units.forEach(function (unit)
			{
				if(unit.isDead()) return;
				if(unit.player == 0) // 1 == Player
				{
					var cdx = Math.abs(unit.sprite.base.x - (game.extra.length-128));
					if(unit.targetRange >= cdx)
					{
						unit.target = null;
						unit.mode = Mode.FightCastle;
						unit.update();
						return;
					}

					for(var i = 0; i < this.player_units.length; i++)
					{
						var punit = this.player_units[i];
						if(punit.isDead()) continue;
						var dx = Math.abs(punit.sprite.base.x - unit.sprite.base.x);

						if(unit.targetRange >= dx)
						{
							unit.target = punit;
							break;
						}
					} 

				}
				else 
				{
					var cdx = Math.abs(unit.sprite.base.x - (128));
					if(unit.targetRange >= cdx)
					{
						unit.target = null;
						unit.mode = Mode.FightCastle;
						unit.update();
						return;
					}

					for(var i = 0; i < this.enemy_units.length; i++)
					{
						var punit = this.enemy_units[i];
						if(punit.isDead()) continue;
						var dx = Math.abs(punit.sprite.base.x - unit.sprite.base.x);

						if(unit.targetRange >= dx)
						{
							unit.target = punit;
							break;
						}
					} 

				}
				unit.update();

			}, this);

			this.castle1.update();
			this.castle2.update();
		}


		if(!this.gameover)
		{
			for(var i = 0; i < this.gui_buttons_rects.length; i++)
			{
				var r = this.gui_buttons_rects[i];
				var c = this.gui_buttons_cooldowns[i];

				if(c.on)
				{
					if(game.time.now > c.current) {
						c.on = false;
						this.gui_buttons_cooldowns[i].on = false;
					}

				}

				if(game.score.gold < costs[i])
					this.gui_buttons_rovers[i].visible = true;
				else
					this.gui_buttons_rovers[i].visible = false;

				if(c.on)
				{

					var diff = (c.current - game.time.now)/c.time;
					this.gui_buttons_overs[i].visible = true;
					this.gui_buttons_overs[i].scale.y = (1-diff)*(game.extra.scale/1.4);
					this.gui_buttons_overs[i].y = r.y+(game.extra.scale/1.4)+14*(game.extra.scale/1.4)*diff;
				}
				else
				{
					this.gui_buttons_overs[i].scale.y = game.extra.scale/1.4;
					this.gui_buttons_overs[i].visible = false;
				}

				if(mx > r.x && mx < r.x+r.width) {
					if(my > r.y && my < r.y+r.height)
					{
						if(!c.on && game.score.gold >= costs[i])
							this.gui_buttons_overs[i].visible = true;

						if(game.input.activePointer.isDown && !c.on && game.score.gold >= costs[i])
						{
							// Buy unit
							if(i==0)
							{
								var u1 = new UnitTest(1, game.extra.length+64, game.height - 256, game);
								this.units.push(u1);
								this.player_units.push(u1);
								u1.speed *= -1;

							}
							else if(i==1)
							{
								var u1 = new UnitTest2(1, game.extra.length+64, game.height - 256, game);
								this.units.push(u1);
								this.player_units.push(u1);
								u1.speed *= -1;
							}
							else if(i==2)
							{
								var u1 = new UnitTest3(1, game.extra.length+64, game.height - 256, game);
								this.units.push(u1);
								this.player_units.push(u1);
								u1.speed *= -1;
							}

							else 
							{
								var u1 = new UnitTest4(1, game.extra.length+64, game.height - 256, game);
								this.units.push(u1);
								this.player_units.push(u1);
								u1.speed *= -1;
							}

							this.click.play();
							game.score.total--;
							game.score.gold -= costs[i];
							var t = cds[i]*1000;
							this.gui_buttons_cooldowns[i] = { on:true, current: game.time.now+t, time:t };
							break;
						}
					}
				}

			}
		}
	},
	updateObjectPosition: function(object)
	{
		//console.log(object);
		if(object.hasOwnProperty('base')) 
		{
			object.x = object.base.x - this.map.x * object.base.parallel;
			object.y =  object.base.y;
		}
		else if(object.type == Phaser.GROUP)
		{
			object.forEachAlive(this.updateObjectPosition2, this);
		}
	},
	updateObjectPosition2: function(object)
	{
		//console.log(object);
		if(object.hasOwnProperty('base')) 
		{
			object.x = object.base.x - this.map.x * object.base.parallel;
			object.y =  object.base.y;
		}
		else if(object.type == Phaser.GROUP)
		{
			object.forEachAlive(this.updateObjectPosition, this);
		}
	},
	showDead: function(object)
	{

		/*if(this.deadParticles.length < 50)
		{
		    var emitter = game.add.emitter(object.x, object.y, 16);
		    this.deadParticles.push(emitter);

		    emitter.makeParticles('red');
		    emitter.bringToTop = true;
		    emitter.gravity = 200;
		   
	    	emitter.setXSpeed(-100, 100);
	    	emitter.setYSpeed(-50, -150);
	    	emitter.minParticleScale = game.extra.scale*64;
			emitter.maxParticleScale = game.extra.scale*64;
			emitter.smoothed = false;
			emitter.timeout = game.time.now + 2000;
		    emitter.x = object.x - game.extra.ingame.map.x;

			emitter.start(true, 1500, null, 16);
		}*/
    	//emitter.forEach(function(a) { a.scale.setTo(game.extra.scale, game.extra.scale); }, this);

	    
	},
	showDamage: function(d, object, body)
	{
		this.hurt.play();
		/*if(this.deadParticles.length < 50)
		{
		    var emitter = game.add.emitter(body.x, body.y, 8);
			this.deadParticles.push(emitter);
		    emitter.makeParticles( [ 'red' ] );
		    emitter.bringToTop = true;
		    emitter.gravity = 200;
		    //emitter.setScale(game.extra.scale, game.extra.scale, game.extra.scale, game.extra.scale, 1000);
	    	emitter.setXSpeed(-40, 40);
	    	emitter.setYSpeed(-20, -60);
	    	//emitter.forEach(function(a) { a.scale.setTo(game.extra.scale, game.extra.scale); }, this);
	    	emitter.minParticleScale = game.extra.scale;
			emitter.maxParticleScale = game.extra.scale;
			emitter.smoothed = false;
			emitter.timeout = game.time.now + 2100;
		    emitter.start(true, 2000, null, 8);
		    emitter.x = object.x - game.extra.ingame.map.x;

		}*/
		var damageText = game.add.bitmapText(object.x, object.y, 'pixel_font_red', "-"+d, 10, this.infoTextGroup);

		var tween = game.add.tween(damageText);
		tween.to({ alpha: 0.0, y: object.y - 30 }, 1000);
		tween.onComplete.add(function() { 
			damageText.destroy();
            tween.onComplete.removeAll();
            tween.stop();
            tween = null;
		});
		tween.start();
	},
	showGold: function(object)
	{
		var goldText = game.add.bitmapText(object.x, object.y, 'pixel_font_gold', '+' + object.gold, 12);
		var tween = game.add.tween(goldText);
		tween.to({ alpha: 0.0, y: object.y - 50 }, 3000);
		tween.onComplete.add(function() { 
			goldText.destroy();
            tween.onComplete.removeAll();
            tween.stop();
            tween = null;
		});
		tween.start();

		this.gold.play();
	},
	explode: function(c)
	{
		var object = c.explodePosition();

		for(var i = 0; i < 30; i++)
		{
			this.createExplosion(object.x + game.rnd.integerInRange(-128, 64), object.y + game.rnd.integerInRange(-128, 128), 0.7 + game.rnd.frac()/0.7);
		}
		/*if(this.deadParticles.length < 50)
		{
		    var emitter = game.add.emitter(object.x, object.y, 256);
			this.deadParticles.push(emitter);
		    emitter.makeParticles( [ 'fire' ] );
		    emitter.bringToTop = true;
		    emitter.gravity = 200;
		    //emitter.setScale(game.extra.scale, game.extra.scale, game.extra.scale, game.extra.scale, 1000);
	    	emitter.setXSpeed(-200, 200);
	    	emitter.setYSpeed(-100, -360);
	    	//emitter.forEach(function(a) { a.scale.setTo(game.extra.scale, game.extra.scale); }, this);
	    	emitter.minParticleScale = game.extra.scale/8;
			emitter.maxParticleScale = game.extra.scale/4;
			emitter.smoothed = false;
			emitter.timeout = game.time.now + 2100;
		    emitter.x = object.x - game.extra.ingame.map.x;
		    emitter.forEach(function(p) {
			     p.smoothed = false;
			});
		    emitter.start(true, 5000, null, 256);
		    emitter.forEach(function(p) {
			     p.smoothed = false;
			});
		}*/
	},
	createExplosion:  function(x, y, d) {
	    var explosion = this.explosions.getFirstDead();

	    if (explosion == null) {
	        explosion = game.add.sprite(0, 0, 'fire');
	        explosion.anchor.setTo(0.5, 0.5);
	        explosion.scale.setTo(1, 1);
	        //explosion.smoothed = false;

	        var animation = explosion.animations.add('boom', [0,1,2,3], d*60, false);
	        animation.killOnComplete = true;

	        this.explosions.add(explosion);
	    }

	    explosion.revive();

	    explosion.x = x;
	    explosion.y = y;

	    explosion.angle = game.rnd.integerInRange(0, 360);

	    this.sexplode.play();
	    explosion.animations.play('boom');
	    return explosion;
	},
	showWin: function() 
	{
		this.show = true;

		this.castle1.removeBar();
		this.castle2.removeBar();

		this.winlose = game.add.sprite(game.width/2, game.height/2, 'gui_winlose');
		this.winlose.anchor.setTo(0.5, 0.5);
		this.winlose.smoothed = false;
		this.winlose.scale.setTo(game.extra.scale, game.extra.scale);

		var x = game.width/2 - 20*(game.extra.scale) + 20;
		var y = game.height/2 - 22*(game.extra.scale) + 32;
		this.winlose.text1 = game.add.bitmapText(x, y, 'pixel_font_gold', 'Victory!', 24);
		this.winlose.text2 = game.add.bitmapText(x, y+32+4, 'pixel_font', 'You have defeated', 13);
		this.winlose.text3 = game.add.bitmapText(x, y+48+2+4, 'pixel_font', 'the enemy and ', 13);
		this.winlose.text4 = game.add.bitmapText(x, y+64+4+4, 'pixel_font', 'destory the ', 13);
		this.winlose.text5 = game.add.bitmapText(x, y+80+6+4, 'pixel_font', 'connection between', 13);
		this.winlose.text6 = game.add.bitmapText(x, y+96+8+4, 'pixel_font', 'their world and ours!', 10);

		this.winlose.text7 = game.add.bitmapText(x, y+112+8+10, 'pixel_font', 'score: ' + game.score.total, 13);

		this.winlose.buttontext1 = game.add.bitmapText(game.width/2 - 12*(game.extra.scale), y + 23*game.extra.scale, 'pixel_font', 'Play again', 15);
		this.winlose.buttontext2 = game.add.bitmapText(game.width/2 - 12*(game.extra.scale), y + 32*game.extra.scale, 'pixel_font', 'Rate (LD)', 15);

		this.winlose.rects = new Array();
		this.winlose.overs = new Array();
		this.winlose.clicks = new Array();
		this.winlose.buttons = new Array();

		var x = game.width/2 - (20)*(game.extra.scale) + 5*game.extra.scale;
		var y = game.height/2 - (22)*(game.extra.scale) + 24*game.extra.scale;
		var w = (30)*(game.extra.scale);
		var h = (6)*(game.extra.scale);
		var r = { x: x, y: y, width: w, height: h };
		this.winlose.rects[0] = r;

		var o2 = game.add.sprite(x, y+(game.extra.scale)-0.1, 'gui_overbutton');
		o2.alpha = 0.3;
		o2.visible = false;
		o2.scale.setTo((game.extra.scale)*(30/9), (game.extra.scale)*(6/14));
		this.winlose.overs[0] = o2;

		this.winlose.clicks[0] = function() { console.log("again"); window.location.reload() };

		var y = game.height/2 - (22)*(game.extra.scale) + 34*game.extra.scale;
		var r = { x: x, y: y, width: w, height: h };
		this.winlose.rects[1] = r;

		var o2 = game.add.sprite(x, y-0.1, 'gui_overbutton');
		o2.alpha = 0.3;
		o2.visible = false;
		o2.scale.setTo((game.extra.scale)*30/9, (game.extra.scale)*6/14);
		this.winlose.overs[1] = o2;
		this.winlose.clicks[1] = function() { console.log("rate"); OpenInNewTab(); };

		this.winlose.buttons[0] = true;
		this.winlose.buttons[1] = true;
	},
	showLose: function() 
	{

		this.winlose = game.add.sprite(game.width/2, game.height/2, 'gui_winlose');
		this.winlose.anchor.setTo(0.5, 0.5);
		this.winlose.smoothed = false;
		this.winlose.scale.setTo(game.extra.scale, game.extra.scale);

		var x = game.width/2 - 20*(game.extra.scale) + 20;
		var y = game.height/2 - 22*(game.extra.scale) + 32;
		this.winlose.text1 = game.add.bitmapText(x, y, 'pixel_font_red', 'DEFEAT!', 22);
		this.winlose.text2 = game.add.bitmapText(x, y+32+4, 'pixel_font', 'You have failed to ', 11);
		this.winlose.text3 = game.add.bitmapText(x, y+48+4, 'pixel_font', 'protect this world', 11);
		this.winlose.text4 = game.add.bitmapText(x, y+64+2+4, 'pixel_font', 'from the enemies!', 11);
		this.winlose.text5 = game.add.bitmapText(x, y+80+4+4, 'pixel_font', 'They have now', 11);
		this.winlose.text6 = game.add.bitmapText(x, y+96+6+4, 'pixel_font', 'sucessfully connected', 10);
		this.winlose.text7 = game.add.bitmapText(x, y+112+7+4, 'pixel_font', 'our worlds together!', 10);

		this.winlose.text8 = game.add.bitmapText(x+10, y+112+8+22, 'pixel_font', 'score: ' + game.score.total, 13);

		this.winlose.buttontext1 = game.add.bitmapText(game.width/2 - 12*(game.extra.scale), y + 23*game.extra.scale, 'pixel_font', 'Play again', 15);
		this.winlose.buttontext2 = game.add.bitmapText(game.width/2 - 12*(game.extra.scale), y + 32*game.extra.scale, 'pixel_font', 'Rate (LD)', 15);

		this.winlose.rects = new Array();
		this.winlose.overs = new Array();
		this.winlose.clicks = new Array();
		this.winlose.buttons = new Array();

		var x = game.width/2 - (20)*(game.extra.scale) + 5*game.extra.scale;
		var y = game.height/2 - (22)*(game.extra.scale) + 24*game.extra.scale;
		var w = (30)*(game.extra.scale);
		var h = (6)*(game.extra.scale);
		var r = { x: x, y: y, width: w, height: h };
		this.winlose.rects[0] = r;

		var o2 = game.add.sprite(x, y+(game.extra.scale)-0.1, 'gui_overbutton');
		o2.alpha = 0.3;
		o2.visible = false;
		o2.scale.setTo((game.extra.scale)*(30/9), (game.extra.scale)*(6/14));
		this.winlose.overs[0] = o2;

		this.winlose.clicks[0] = function() { console.log("again"); window.location.reload() };

		var y = game.height/2 - (22)*(game.extra.scale) + 34*game.extra.scale;
		var r = { x: x, y: y, width: w, height: h };
		this.winlose.rects[1] = r;

		var o2 = game.add.sprite(x, y-0.1, 'gui_overbutton');
		o2.alpha = 0.3;
		o2.visible = false;
		o2.scale.setTo((game.extra.scale)*30/9, (game.extra.scale)*6/14);
		this.winlose.overs[1] = o2;
		this.winlose.clicks[1] = function() { console.log("rate"); OpenInNewTab(); };

		this.winlose.buttons[0] = true;
		this.winlose.buttons[1] = true;

		this.castle1.removeBar();
		this.castle2.removeBar();

		var emitter = game.add.emitter(game.world.centerX, 0, 400);

		emitter.width = game.world.width;
		// emitter.angle = 30; // uncomment to set an angle for the rain.

		emitter.makeParticles('rain');

		emitter.minParticleScale = 0.1;
		emitter.maxParticleScale = 0.5;

		emitter.setYSpeed(300, 500);
		emitter.setXSpeed(-5, 5);

		emitter.minRotation = 0;
		emitter.maxRotation = 0;

		emitter.start(false, 1600, 5, 0);

		this.show = true;

		var tween = game.add.tween(this.sky);
		tween.to({ alpha: 0.0 }, 1000);
		tween.start();

		var tween = game.add.tween(this.scope);
		tween.to({ alpha: 1.0 }, 1000);
		tween.start();

		for (var i = 0; i < this.clouds.length; i++) {
			var c = this.clouds[i].get_darker();
			var tween = game.add.tween(this.clouds[i]);
			tween.to({ tx: c }, 1000);
			tween.start();
		};
	}
};

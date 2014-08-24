/*
*
*  Julgodis 2014
*  ingame.js
*
*/

var InGame = function (game) { };
InGame.prototype = 
{
	// Not needed, everythings is already loaded!
	//preload: function() {} 

	background1: null,
	background2: null,
	background3: null,
	ground: null,
	fpsText: null,
	infoTextGroup: null,
	deadParticles: null,

	gui_base: null,
	gui_buttons_rects: null,
	gui_buttons_overs: null,
	gui_buttons_icons: null,
	gui_buttons_costs: null,
	gui_buttons_cooldowns: null,

	gui_gold_text: null,

	trees: null,
	clouds: null,
	units: null,
	player_units: null,
	enemy_units: null,
	map: { x: 0, vx: 0 },
	create: function()
	{
		game.extra.ingame = this;
		game.extra.length = 800*1.8;
		game.world.setBounds(0, 0, game.extra.length, 600);
		game.extra.world = game.add.group();

		this.map.x = game.extra.length-game.width;

		/* Add background */

		this.background1 = game.add.game.add.sprite(0, game.height+4*game.extra.scale, 'background1', null, game.extra.world);
		this.background1.smoothed = false;
		this.background1.anchor.setTo(0, 1);
		this.background1.scale.setTo(game.extra.scale*1.2*0.8, game.extra.scale*0.8);

		// this add a parallel effect to the background
		this.background1.base = {};
		this.background1.base.x = this.background1.x;
		this.background1.base.y = this.background1.y;
		this.background1.base.parallel = 0.1;

		this.background2 = game.add.game.add.sprite(0, game.height+4*game.extra.scale, 'background2', null, game.extra.world);
		this.background2.smoothed = false;
		this.background2.anchor.setTo(0, 1);
		this.background2.scale.setTo(game.extra.scale*1.2*0.8, game.extra.scale*0.8);

		// this add a parallel effect to the background
		this.background2.base = {};
		this.background2.base.x = this.background1.x;
		this.background2.base.y = this.background1.y;
		this.background2.base.parallel = 0.2;


		this.background3 = game.add.game.add.sprite(0, game.height+4*game.extra.scale, 'background3', null, game.extra.world);
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
				console.log(dscale);
			tree.init(x, y, game.extra.scale - ((game.extra.treeCount-i-1.0)/(game.extra.treeCount))*6 - 1.0, ttype);
			this.trees.push(tree);
		}

		/* Add ground */

		this.ground = game.add.game.add.sprite(0, game.height, 'ground', null, game.extra.world);
		this.ground.smoothed = false;
		this.ground.anchor.setTo(0, 1);
		this.ground.scale.setTo(game.extra.scale, game.extra.scale);
		
		this.ground.base = {};
		this.ground.base.x = this.ground.x;
		this.ground.base.y = this.ground.y;
		this.ground.base.parallel = 1.0;


		var castle1 = new Castle();
		castle1.type = 1; // 1 is Player
		castle1.init();

		var castle2 = new Castle();
		castle2.type = 0; // 0 is Computer
		castle2.init();

		/* Add Units */
		this.units = new Array();
		this.player_units = new Array();
		this.enemy_units = new Array();

		for(var i = 0; i < 10; i++)
		{
			if(game.rnd.frac() <= 0.5)
			{
				var u1 = new UnitTest(0, -64 - 350*i, game.height-256, game);
				this.units.push(u1);
				this.enemy_units.push(u1);
			}
			else {if(game.rnd.frac() <= 0.5)
			{
				var u1 = new UnitTest2(0, -64 - 350*i, game.height-256, game);
				this.units.push(u1);
				this.enemy_units.push(u1);
			} else 
			{
				var u1 = new UnitTest3(0, -64 - 350*i, game.height-256, game);
				this.units.push(u1);
				this.enemy_units.push(u1);
			}}
		}/*

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


		this.gui_buttons_icons = new Array();
		this.gui_buttons_costs = new Array();
		this.gui_buttons_rects = new Array();
		this.gui_buttons_rovers = new Array();
		this.gui_buttons_overs = new Array();
		this.gui_buttons_cooldowns = new Array();
		for(var i = 0; i < 3; i++)
		{
			var t = game.add.sprite(game.width - 80*(game.extra.scale/1.4) + (11 + 14.0*i)*(game.extra.scale/1.4), 3.5*(game.extra.scale/1.4), 'unit'+(i+1), null, game.extra.world);
			t.smoothed = false;
			t.anchor.setTo(1, 0);
			t.scale.setTo(game.extra.scale/3.5, game.extra.scale/3.5);
			this.gui_buttons_icons[i] = t;

			var c = game.add.bitmapText(game.width - 80*(game.extra.scale/1.4) + (11 + 14.0*i)*(game.extra.scale/1.4) - (11*8)/3 - 4, 82, 'pixel_font_gold', ""+costs[i] , 12);
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
	},
	shutdown: function()
	{
		
	},
	update: function()
	{
		this.gui_gold_text.setText(""+game.score.gold);

		var mx = game.input.x;
		var my = game.input.y;

		if (this.game.time.fps !== 0) {
		    this.fpsText.setText(this.game.time.fps + ' FPS');
		}		
		if(my > 150)
		{
			if(mx <= 200)
				this.map.vx -= 0.015 + ((200-mx)*(200-mx))/3200000;
			else if(mx >= game.width-200)
				this.map.vx += 0.015 + ((mx-game.width-200)*(mx-game.width-200))/3200000;
		}

		if(this.map.vx > 12) this.map.vx = 12;
		if(this.map.vx < -12) this.map.vx = -12;

		this.map.x += this.map.vx;
		if(this.map.x < 0) this.map.x = 0;
		if(this.map.x+game.width > game.extra.length) this.map.x = game.extra.length-game.width;
		this.map.vx *= 0.98;

		game.extra.world.forEachAlive(this.updateObjectPosition, this);
		this.units.forEach(function (unit)
		{
			if(unit.isDead()) return;
			if(unit.player == 0) // 1 == Player
			{
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
						else 
						{
							var u1 = new UnitTest3(1, game.extra.length+64, game.height - 256, game);
							this.units.push(u1);
							this.player_units.push(u1);
							u1.speed *= -1;
						}

						game.score.gold -= costs[i];
						var t = 2000;
						this.gui_buttons_cooldowns[i] = { on:true, current: game.time.now+t, time:t };
						break;
					}
				}
			}

		}
	},
	updateObjectPosition: function(object)
	{
		if(object.hasOwnProperty('base')) 
		{
			//console.log(object);
			object.x = object.base.x - this.map.x * object.base.parallel;
			object.y =  object.base.y;
		}
	},
	showDead: function(object)
	{
		if(this.deadParticles.length < 50)
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

			emitter.start(true, 1500, null, 16);
		}
    	//emitter.forEach(function(a) { a.scale.setTo(game.extra.scale, game.extra.scale); }, this);

	    
	},
	showDamage: function(d, object, body)
	{
		if(this.deadParticles.length < 50)
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
		}
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
	}
};

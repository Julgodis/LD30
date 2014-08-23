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

	ground: null,
	trees: null,
	map: { x: 0, vx: 0 },
	create: function()
	{
		game.extra.length = 800*1.8;
		game.world.setBounds(0, 0, game.extra.length, 600);
		game.extra.world = game.add.group();


		/* Add Trees */

		this.trees = new Array();
		for(var i = 0; i < game.extra.treeCount; i++)
		{
			var x, y;

			while(true)
			{
				x = game.rnd.integerInRange(100, game.extra.length-100);
				y = game.height - (8*game.extra.scale);

				var redo = false;
				for(var j = 0; j < this.trees.length; j++)
				{
					if(Math.abs(this.trees[j].sprite.base.x - x) <= 8*game.extra.scale)
					{
						redo = true;
						break;
					}

				}
				if(redo) continue;
				break;
			}

			var tree = new Tree();
			tree.init(x, y, game.extra.scale + (game.rnd.integerInRange(0, 100)/100 - 0.5)*3 - 1.0);
			this.trees.push(tree);
		}

		/* Add ground */

		this.ground = game.add.game.add.sprite(0, game.height, 'ground_tile', null, game.extra.world);
		this.ground.smoothed = false;
		this.ground.anchor.setTo(0, 1);
		this.ground.scale.setTo(game.extra.scale * game.extra.length, game.extra.scale);


		var castle1 = new Castle();
		castle1.type = 1; // 1 is Player
		castle1.init();

		var castle2 = new Castle();
		castle2.type = 0; // 0 is Computer
		castle2.init();

	},
	shutdown: function()
	{
		
	},
	update: function()
	{
		var mx = game.input.x;
		var my = game.input.y;

		//console.log("X: " + mx + ", Y: " + my);
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
	},

	updateObjectPosition: function(object)
	{
		if(object.hasOwnProperty('base')) {
			object.position.x = object.base.x - this.map.x;
		}
	}
};

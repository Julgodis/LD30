/*
*
*		Julgodis 2014
*		enemy.js
*
*/

var EnemyAI = function(game) { };

EnemyAI.prototype = 
{
	gold: 40,
	goldPP: 0,

	cd1: 0,
	cd2: 0,
	cd3: 0,
	init: function()
	{
		level = 1;

	},
	update: function()
	{
		//console.log("LEVEL: " +level);
		//console.log("GOLD : " +this.gold);
		//console.log("CD1  : " +(this.cd1-game.time.now)/1000);
		level += 0.0001;
		if(game.time.now >= this.goldPP)
		{
			this.gold++;
			this.goldPP = game.time.now + 5000;
		}

		if(level <= 1.5)
		{
			if(this.gold > 10 && game.time.now >= this.cd1 && game.rnd.frac() <= 0.1)
			{
				this.gold-=10;
				var u1 = new UnitTest(0, -64, game.height-256, game);
				game.extra.ingame.units.push(u1);
				game.extra.ingame.enemy_units.push(u1);
				this.cd1 = game.time.now + cds[0]*1000*1.8;
			}


		}
		else if(level <= 2.5)
		{
			if(this.gold > 10 && game.time.now >= this.cd1 && game.rnd.frac() <= 0.1)
			{
				this.gold-=10;
				var u1 = new UnitTest(0, -64, game.height-256, game);
				game.extra.ingame.units.push(u1);
				game.extra.ingame.enemy_units.push(u1);
				this.cd1 = game.time.now + cds[0]*1000*1.8;
			}
			else if(this.gold > 30 && game.time.now >= this.cd2 && game.rnd.frac() <= 0.1)
			{
				this.gold-=10;
				var u1 = new UnitTest2(0, -64, game.height-256, game);
				game.extra.ingame.units.push(u1);
				game.extra.ingame.enemy_units.push(u1);
				this.cd2 = game.time.now + cds[1]*1000*1.8;
			}

		}
		else 
		{
			if(this.gold > 10 && game.time.now >= this.cd1 && game.rnd.frac() <= 0.1)
			{
				this.gold-=10;
				var u1 = new UnitTest(0, -64, game.height-256, game);
				game.extra.ingame.units.push(u1);
				game.extra.ingame.enemy_units.push(u1);
				this.cd1 = game.time.now + cds[0]*1000*1.8;
			}
			else if(this.gold > 30 && game.time.now >= this.cd2 && game.rnd.frac() <= 0.1)
			{
				this.gold-=30;
				var u1 = new UnitTest2(0, -64, game.height-256, game);
				game.extra.ingame.units.push(u1);
				game.extra.ingame.enemy_units.push(u1);
				this.cd2 = game.time.now + cds[1]*1000*1.8;
			}
			else if(this.gold > 55 && game.time.now >= this.cd3 && game.rnd.frac() <= 0.1)
			{
				this.gold-=55;
				var u1 = new UnitTest3(0, -64, game.height-256, game);
				game.extra.ingame.units.push(u1);
				game.extra.ingame.enemy_units.push(u1);
				this.cd3 = game.time.now + cds[2]*1000*1.8;
			}
		}
	}

}
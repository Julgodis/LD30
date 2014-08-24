/*
*
*		Julgodis 2014
*		unit_test.js
*
*/


var Arrow = function(game, x, y, speed, c)
{
	Phaser.Sprite.call(this, game, 0, 0, 'arrow');
	this.scale.smoothed = false;
	this.scale.setTo(game.extra.scale/3, game.extra.scale/3);
	this.anchor.setTo(0.5, 0.5);
	this.scale.smoothed = false;

   /* this.game.add.tween(this)
        .to(
            { wobble: -30 },
            this.WOBBLE_SPEED, Phaser.Easing.Sinusoidal.InOut, true, 0,
            Number.POSITIVE_INFINITY, true
        );*/

	this.tick = 2000;
	this.speed = speed;
	this.main = c;
	this.base = { x: x, y: y, parallel: 1.0 };
	this.exists = true;
	this.visible = true;
	this.alive = true;
	this.buffer = game.time.now;
}

Arrow.prototype = Object.create(Phaser.Sprite.prototype);
Arrow.prototype.constructor = Arrow;

Arrow.prototype.update = function() 
{
	if(this.speed < 0)
		this.scale.setTo(game.extra.scale/3, game.extra.scale/3);
	else if(this.speed > 0)
		this.scale.setTo(-game.extra.scale/3, game.extra.scale/3);

	if (!this.alive) 
	{
        return;
    } 

    this.tick--;
    if(this.tick < 0)
    {
		this.main.target = null;
		this.main.mode = Mode.Idle;
    	this.main.isShoting  = false;
    	this.kill();
    	return;
    }

	if(this.main.player == 0) // 1 == Player
	{
		for(var i = 0; i < game.extra.ingame.player_units.length; i++)
		{
			var s = game.extra.ingame.player_units[i];
			if(s.isDead()) continue;
			var nx = s.sprite.base.x;
			var ny = s.sprite.base.y;

			var dx = (nx - this.base.x);
			var dy = (ny - this.base.y);

			var distance = dx*dx;
			if(Math.sqrt(distance) < s.size.width)
			{

				this.main.isShoting  = false;
				s.attack(this.main.basicAttackDamage);
				this.main.basicAttackTimer = game.time.now + (1/this.main.basicAttackSpeed)*1000 + game.rnd.integerInRange(-100, 100);

				this.main.target = null;
				this.main.mode = Mode.Idle;
		    	this.main.isShoting  = false;
		    	this.kill();
				return;
			}
		}
	}
	else 
	{
		for(var i = 0; i < game.extra.ingame.enemy_units.length; i++)
		{
			var s = game.extra.ingame.enemy_units[i];
			if(s.isDead()) continue;
			var nx = s.sprite.base.x;
			var ny = s.sprite.base.y;

			var dx = (nx - this.base.x);
			var dy = (ny - this.base.y);

			var distance = dx*dx;
			if(Math.sqrt(distance) < s.size.width)
			{

				this.main.isShoting  = false;
				s.attack(this.main.basicAttackDamage);
				this.main.basicAttackTimer = game.time.now + (1/this.main.basicAttackSpeed)*1000 + game.rnd.integerInRange(-100, 100);

				this.main.target = null;
				this.main.mode = Mode.Idle;
		    	this.main.isShoting  = false;
		    	this.kill();
				return;
			}
		}
	}
    this.base.x += this.speed*game.time.elapsed;
    this.base.y += Math.cos((this.buffer+game.time.now)/200.0)*(game.time.elapsed/40.0);
    //this.x = this.base.x;
    //this.y = this.base.y;
   // console.log(this.base);
}


var UnitTest3 = function(p, x, y, game)
{
	//Unit.init(this, x, y, 'unit1', 0, game.extra.scale);
	var scale = (game.extra.scale/3)-0.5 * game.rnd.frac();

	Unit.apply(this,arguments);
	this.init(p, x, y, 'unit3', 0, scale);

	this.jumpCounter = game.rnd.integerInRange(1000, 3000);
	this.dojump = false;

	this.basicAttackSpeed = 0.8;
	this.basicAttackDamage = 18;
	this.basicAttackTimer = 0;
	this.basicArrowSpeed = 0.3;
	this.isShoting = false;

	this.targetRange = 22*scale*7;
	this.speed = 0.9 + 0.05*game.rnd.frac();
	this.gold = 35;
	this.arrows = new Array();

	this.size = { width: 22, height: 22 };
};
UnitTest3.prototype = Object.create(Unit.prototype);
UnitTest3.prototype.constructor = UnitTest3;

UnitTest3.prototype.initUnit = function()
{
	this.gravity = true;
	this.usefliping = true;

	//this.sprite.base.parallel = 1.2 + 0.3 * ((this.scale)/(game.extra.scale/3));

};

UnitTest3.prototype.addUnitAnimations = function()
{
	this.sprite.animations.add('idle', [0], 1, true);
	this.sprite.animations.add('walk', [1, 0, 2, 0], 16, true);
	this.sprite.animations.add('basic_attack', [0, 0, 0, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 0], 60, false);
	this.sprite.play('walk');
};

UnitTest3.prototype.updateUnit = function()
{
	if(this.target == null)
	{
		this.mode = Mode.Idle;
	}
	else 
	{
		this.mode = Mode.FightUnit;
		var dx = this.target.sprite.base.x - this.sprite.base.x;
		if(Math.abs(dx) > this.basicAttackRange)
		{
			this.target = null;
			this.mode = Mode.Idle;
		}
	}

	if(this.mode == Mode.Idle)
	{
		this.sprite.play('walk');
		this.velocity.x = this.speed;
	}
	else if(this.mode == Mode.FightUnit)
	{
		this.velocity.x = 0;
		if(game.time.now > this.basicAttackTimer && !this.isShoting)
		{
			this.shotAt(this.target);
		}
	}

	var d = new Array();
	this.arrows.forEach(function(a) {
		if(!a.alive)
			d.push(a);
		else
			a.update();
	}, this);

	d.forEach(function (b) {
		this.arrows.remove(b);
	}, this);
	/*if(!this.dojump && Math.abs(this.velocity.y) < 0.005 && game.time.now > this.jumpCounter) {
		this.dojump = true;
	}

	if(this.dojump == true && game.time.now - 400 <= this.jumpCounter)
	{
		this.velocity.y -= 1;
	}
	else if(this.dojump == true)
	{
		this.dojump = false;
		this.jumpCounter = game.time.now + game.rnd.integerInRange(4000, 6000);
	}*/
};


UnitTest3.prototype.shotAt = function(target)
{
	this.isShoting  = true;
	this.sprite.animations.stop();
	this.sprite.play('basic_attack');

	var x = this.sprite.base.x;
	var y = this.sprite.base.y - (this.size.height-6)*this.scale;

	var dir = Math.abs(this.speed)/this.speed;
	var arrow = new Arrow(game, x, y, dir*this.basicArrowSpeed, this);
	arrow.smoothed = false;
	//this.group.add(arrow);
	game.extra.world.add(arrow);

	this.arrows.push(arrow);

/*
	var tween = game.add.tween(arr);
	tween.to({ y: ny, x: nx }, distance*this.basicArraySpeed);
	tween.onComplete.add(function() { 

		this.isShoting  = false;
		this.target.attack(this.basicAttackDamage);
		this.basicAttackTimer = game.time.now + (1/this.basicAttackSpeed)*1000 + game.rnd.integerInRange(-200, 200);

		if(this.target.isDead())
		{
			this.target = null;
			this.mode = Mode.Idle;
		}

		arr.destroy();
        tween.onComplete.removeAll();
        tween.stop();
        tween = null;
	});
	tween.start();*/
};


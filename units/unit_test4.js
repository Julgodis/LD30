/*
*
*		Julgodis 2014
*		unit_test.js
*
*/

var UnitTest4 = function(p, x, y, game)
{
	//Unit.init(this, x, y, 'unit1', 0, game.extra.scale);
	var scale = (game.extra.scale/3)-0.5 * game.rnd.frac();

	//Unit.apply(this,arguments);
	this.init(p, x, y, 'unit4', 0, scale);

	this.jumpCounter = game.rnd.integerInRange(1000, 3000);
	this.dojump = false;

	this.basicAttackSpeed = 1.5;
	this.basicAttackDamage = 120;
	this.basicAttackTimer = 0;
	this.maxHealth = 700.0;
	this.health = 700.0;

	this.targetRange = 22*scale*2;
	this.speed = 0.3 + 0.05*game.rnd.frac();
	this.gold = 200;

	this.size = { width: 44, height: 44 };
};
UnitTest4.prototype = Object.create(Unit.prototype);
UnitTest4.prototype.constructor = UnitTest4;

UnitTest4.prototype.initUnit = function()
{
	this.gravity = true;
	this.usefliping = true;

	//this.sprite.base.parallel = 1.2 + 0.3 * ((this.scale)/(game.extra.scale/3));

};

UnitTest4.prototype.addUnitAnimations = function()
{
	this.sprite.animations.add('idle', [0], 1, true);
	this.sprite.animations.add('walk', [2, 0, 3, 0], 11, true);
	this.sprite.animations.add('basic_attack', [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], 60, false);
	this.sprite.play('walk');
};

UnitTest4.prototype.updateUnit = function()
{	
	if(this.mode != Mode.FightCastle)
	{
		if(this.target == null)
		{
			this.mode = Mode.Idle;
		}
		else if(this.target.isDead())
		{
				this.target = null;
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
	}

	if(this.mode == Mode.Idle)
	{
		this.sprite.play('walk');
		this.velocity.x = this.speed;
	}
	else if(this.mode == Mode.FightUnit)
	{
		this.velocity.x = 0;
		if(game.time.now > this.basicAttackTimer)
		{
			this.sprite.animations.stop();
			this.sprite.play('basic_attack');

			this.health = Math.min(this.maxHealth, this.health + this.basicAttackDamage);
			this.basicAttackTimer = game.time.now + (1/this.basicAttackSpeed)*1000 + game.rnd.integerInRange(-200, 200);
		}
	}
	else if(this.mode == Mode.FightCastle)
	{

		this.velocity.x = 0;
		if(game.time.now > this.basicAttackTimer)
		{
			this.sprite.animations.stop();
			var t = game.extra.ingame.castle1;
			if(this.player == 1)
				t = game.extra.ingame.castle2;
			this.sprite.play('basic_attack');
			this.health = Math.min(this.maxHealth, this.health + this.basicAttackDamage);
			this.basicAttackTimer = game.time.now + (1/this.basicAttackSpeed)*1000 + game.rnd.integerInRange(-200, 200);
		}
	}
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

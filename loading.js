/*
*
*  Julgodis 2014
*  loading.js
*
*/

var Start = function (game) { };
var Loader = function (game) { };

Start.prototype = 
{
	preload: function()
	{
		game.stage.backgroundColor = '#0094FF';

		game.load.bitmapFont('pixel_font', 'assets/font.png', 'assets/font.xml');
		game.load.bitmapFont('pixel_font_red', 'assets/font_red.png', 'assets/font.xml');
		game.load.bitmapFont('pixel_font_gold', 'assets/font_gold.png', 'assets/font.xml');
		//game.load.bitmapFont('pixel_font_blue', 'assets/fontBlue.png', 'assets/font.xml');

	},
	create: function()
	{
		game.state.start('loading');
	}
};

Loader.prototype = 
{
	preload: function ()
	{
		var w = game.width;
		var h = game.height;

		var text = game.add.bitmapText(w / 2, (h / 2) - 10, 'pixel_font', 'Loading...', 18);
		text.position.x = (w / 2) - 100;	

		game.load.image('red', 'assets/red.png');
		game.load.image('green', 'assets/green.png');
		game.load.spritesheet('fire', 'assets/fire.png', 128, 128);
		game.load.image('rain', 'assets/rain.png');


		/* GUI */
		game.load.image('gui_main_base', 'assets/gui_main_base.png');
		game.load.image('gui_winlose', 'assets/gui_win_lose.png');
		game.load.image('gui_menu', 'assets/gui_menu.png');
		game.load.image('gui_overbutton', 'assets/gui_overbutton.png');

		/* TOWERS */
		game.load.image('evil_tower1', 'assets/evil_tower1.png');
		game.load.image('good_tower1', 'assets/good_tower1.png');

		/* GROUND */
		game.load.image('ground', 'assets/ground.png');
		game.load.image('background1', 'assets/background1.png');
		game.load.image('background2', 'assets/background2.png');
		game.load.image('background3', 'assets/background3.png');
		game.load.image('sky', 'assets/sky.png');
		game.load.image('dark_sky', 'assets/dark_sky.png');
		game.load.image('scope', 'assets/scope.png');

		game.load.image('cloud1', 'assets/cloud1.png');
		game.load.image('cloud2', 'assets/cloud2.png');

		/* TREES */
		game.load.spritesheet('tree_spritesheet1', 'assets/tree_spritesheet1.png', 20, 32);
		game.load.spritesheet('tree_spritesheet2', 'assets/tree_spritesheet2.png', 20, 32);

		game.load.spritesheet('tree_spritesheet10', 'assets/tree_spritesheet10.png', 20, 32);

		/* UNITS */
		game.load.spritesheet('unit1', "assets/unit1.png", 16, 21);
		game.load.spritesheet('unit2', "assets/unit2.png", 22, 22);
		game.load.spritesheet('unit3', "assets/unit3.png", 22, 22);


		game.load.image('bodypart1', "assets/bodypart1.png");
		game.load.image('bodypart2', "assets/bodypart2.png");

		game.load.image('arrow', "assets/arrow.png");


		/* SOUND */

		game.load.audio('bow', 'assets/bow.wav');
		game.load.audio('click', 'assets/click.wav');
		game.load.audio('explode', 'assets/explode.wav');
		game.load.audio('hit', 'assets/hit.wav');
		game.load.audio('hurt', 'assets/hurt.wav');
		game.load.audio('gold', 'assets/gold.wav');
		game.load.audio('music', 'assets/LD30.mp3');
	},
	create: function()
	{
		game.state.start('intro');
	}
};

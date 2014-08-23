/*
*
*  Julgodis 2014
*  game.js
*
*/

var game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game');
game.extra = {
	world: null,
	scale: 8.0,
	treeCount: 10,
	length: 0,
};

game.state.add('start', Start);
game.state.add('loading', Loader);

game.state.add('game', InGame);

// Run game!
game.state.start('start');

/*
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-39491934-3', 'github.com');
ga('send', 'pageview');*/

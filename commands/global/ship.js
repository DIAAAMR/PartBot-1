module.exports = {
	cooldown: 10000,
	help: `Ships peeps!`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
	if (!args.length) return Bot.pm(by, unxa);
		let cargs = args.join(' ').split(',').map(term => term.trim());
		if (cargs.length < 1 || cargs.length > 2) return Bot.pm(by, unxa);
		if (!cargs[1]) cargs.push(by.substr(1));
		let terms = Array.from(cargs);
		cargs.sort();
		let comp;
		comp = require('crypto').createHash('md5').update(toId(cargs[0]) + '&' + toId(cargs[1]), 'utf8').digest('hex').split('').map(letter => tools.scrabblify(letter) ** 13).reduce((a, b) => a + b) % 101;
		if (tools.hasPermission(by, 'gamma', room)) return Bot.say(room, `I do declare that ${cargs[0]} and ${cargs[1]} are ${comp}% compatible!`);
		else return Bot.pm(by, `I do declare that ${terms[0]} and ${terms[1]} are ${comp}% compatible!`);
	}
}
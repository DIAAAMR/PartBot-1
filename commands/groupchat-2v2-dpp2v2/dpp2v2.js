module.exports = {
	cooldown: 10000,
	help: `Starts a DPP 2v2 Tour.`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		let type;
		if (args.length) {
			switch (toId(args.join(''))) {
				case 'rr': case 'roundrobin': type = 'Round Robin'; break;
				case 'drr': case '2rr': case 'doubleroundrobin': type = 'Round Robin, , 2'; break;
				default: {
					let id = toId(args.join(''));
					if (!/^e(?:lim(?:ination)?)?[1-9][0-9]*$/.test(id)) return Bot.say(room, `Not a recognized type, sorry. Valid ones are: RR, DRR, Elimination (n)`);
					let n = parseInt(id.replace(/[^0-9]/g, ''));
					if (isNaN(n)) return Bot.log(`Uhh, n isn't a number. ${id}`);
					type = `Elimination, , ${n}`;
					break;
				}
			}
		}
		else type = 'Round Robin';
		Bot.say(room, `/tour create gen4doublesou, ${type}\n/tour rules +Deoxys-Defense, +Deoxys-Speed, -Garchomp, -Latios, -Jirachi, -Perish Song, -Self-Destruct, -Focus Sash, Accuracy Moves Clause, Two vs Two, Team Preview\n/tour name [Gen 4] 2v2 Doubles`);
	}
}
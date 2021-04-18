module.exports = {
	cooldown: 100,
	help: `Adds points to users. Syntax: ${prefix}addpoints (user1), (user2), (points)`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!Bot.rooms[room].lb) return Bot.say(room, 'This room doesn\'t have a Leaderboard!');
		if (!Bot.rooms[room].lb.points[0]) return Bot.pm(by, 'This room doesn\'t have that currency. o.o');
		let cargs = args.join(' ').split(/\s*,\s*/);
		let cur = Bot.rooms[room].lb.points[0];
		let points, users = [], flag = false;
		for (let thing of cargs) {
			if (/[a-z]/i.test(thing)) users.push(thing);
			else {
				let n = parseInt(thing);
				if (isNaN(n)) return Bot.say(room, `Invalid number.`);
				if (flag) return Bot.say(room, `Uhh, you gave multiple values of ${cur[1]} to be added.`);
				flag = true;
				points = n;
			}
		}
		if (!flag) points = 1;
		users.forEach(user => tools.addPoints(0, user, -points, room)).then(peeps => {
			Bot.say(room, `${points} ${points === 1 ? cur[0] : cur[1]} ${points === 1 ? 'was' : 'were'} awarded to ${tools.listify(peeps)}.`);
		}).catch(e => {
			Bot.say(room, e.message);
		});
	}
}
module.exports = {
	cooldown: 1,
	help: `The Lights Out game! Use \`\`${prefix}lightsout new\`\` to create a game, and just click from there.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client, isPM) {
		if (!tools.canHTML(room)) return Bot.pm(by, "Sorry, but I kinda need to be a Bot here to do that. Try getting an RO to promote me.");
		if (!Bot.rooms[room].lightsout) Bot.rooms[room].lightsout = {};
		const LO = Bot.rooms[room].lightsout;
		let user = toId(by);
		if (!args.length) args.push('help');
		switch (toId(args.shift())) {
			case 'help': case 'h': case 'htp': {
				if (tools.hasPermission(by, 'gamma', room) && !isPM) return Bot.say(room, "https://www.logicgamesonline.com/lightsout/");
				else return Bot.pm(by, "https://www.logicgamesonline.com/lightsout/");
				break;
			}
			case 'new': case 'n': {
				if (isPM) return Bot.pm(by, `Do it in chat you nerd`);
				if (LO[user]) return Bot.pm(by, `Err, you already have a game running. If you want to make a new one, try using \`\`${prefix}lightsout resign\`\` and trying again.`);
				args = args.join(' ').split(/[, x]/).filter(m => m).map(n => parseInt(n));
				let size;
				if (args.length !== 2 || isNaN(args[0]) || isNaN(args[1])) size = [5, 5];
				else size = args;
				if (size[0] >= 21 || size[1] >= 21) return Bot.pm(by, "WAY TOO LARGE AAAA");
				if (size[0] < 2 || size[1] < 2) return Bot.pm(by, "Sorry, I can't allow anything smaller than my IQ.");
				LO[user] = GAMES.create('lightsout', room, by.substr(1), size);
				const header = `<div style="display: inline-block; float: left; font-weight: bold;">My Solution: ${LO[user].soln.length} moves</div><div style="display: inline-block; float: right; font-weight: bold;">Moves Made: ${LO[user].moves.length} moves</div><br /><br /><br />`;
				Bot.say(room, `/sendhtmlpage ${by}, Lights Out (${by.substr(1)}), ${header + LO[user].boardHTML(true)}`);
				Bot.say(room, `${by.substr(1)} is playing a game of Lights Out - type \`\`${prefix}lightsout spectate ${by.substr(1)}\`\` to watch!`);
				return;
				break;
			}
			case 'click': case 'c': {
				if (!LO[user]) return Bot.pm(by, "Err, you don't have any running games - try making one?");
				args = args.map(t => parseInt(t));
				let out = LO[user].click(...args);
				const header = `<div style="display: inline-block; float: left; font-weight: bold;">My Solution: ${LO[user].soln.length} moves</div><div style="display: inline-block; float: right; font-weight: bold;">Moves Made: ${LO[user].moves.length} moves</div><br /><br /><br />`;
				if (out === null) return Bot.pm(by, "Use the buttons. O-onegai.");
				LO[user].ff = false;
				if (out === false) {
					Bot.say(room, `/sendhtmlpage ${by}, Lights Out (${by.substr(1)}), ${header + LO[user].boardHTML(true)}`);
					LO[user].spectators.forEach(p => Bot.say(room, `/sendhtmlpage ${p}, Lights Out (${by.substr(1)}), ${header + LO[user].boardHTML()}`));
					return;
				}
				if (out === true) {
					Bot.say(room, `/sendhtmlpage ${by}, Lights Out (${by.substr(1)}), ${header + LO[user].boardHTML()}<br /><br /><h1 style="text-align: center;">Done! Congratulations!</h1>`);
					LO[user].spectators.forEach(p => Bot.say(room, `/sendhtmlpage ${p}, Lights Out (${by.substr(1)}), ${header + LO[user].boardHTML()}`));
					if (LO[user].size.reduce((a, b) => a * b, 1) < 25) Bot.pm(by, `You solved it in ${LO[user].moves.length} moves! (My solution was ${LO[user].soln.length} moves)`);
					else {
						Bot.say(room, `/adduhtml Lights Out @ ${Date.now()}, ${LO[user].boardHTML(false, LO[user].problem, true)}`);
						Bot.say(room, `${by.substr(1)} solved this in ${LO[user].moves.length} moves! (My solution was ${LO[user].soln.length} moves)`);
					}
					delete LO[user];
					return;
				}
				Bot.say(room, "AAAAAA");
				Bot.log(LO);
				break;
			}
			case 'spectate': case 's': case 'watch': case 'w': {
				if (!args.length) return Bot.pm(by, "Err, whose game do you want to watch?");
				player = toId(args.join(''));
				if (!LO[player]) return Bot.pm(by, `I couldn't find a listed game for ${player}.`);
				if (player === user) return Bot.pm(by, ">spectating your own game what");
				if (LO[player].spectators.includes(user)) return Bot.pm(by, "You're already spectating! Try using unspectate if you don't want to spectate.");
				if (LO[player].size.reduce((a, b) => a * b, 1) < 25) return Bot.pm(by, "Due to flooding, spectating has been disabled for smaller games.");
				LO[player].spectators.push(user);
				Bot.pm(by, `You're now spectating ${LO[player].name}'s game!`);
				const header = `<div style="display: inline-block; float: left; font-weight: bold;">My Solution: ${LO[player].soln.length} moves</div><div style="display: inline-block; float: right; font-weight: bold;">Moves Made: ${LO[player].moves.length} moves</div><br /><br /><br />`;
				Bot.say(room, `/sendhtmlpage ${by}, Lights Out (${player}), ${header + LO[player].boardHTML()}`);
				break;
			}
			case 'unspectate': case 'us': case 'unwatch': case 'uw': {
				if (!args.length) {
					let ind = Object.values(LO).find(game => game.spectators.includes(user));
					if (ind) args = [ind];
					else return Bot.pm(by, "Err, whose game do you want to stop watching?");
				}
				player = toId(args.join(''));
				if (!LO[player]) return Bot.pm(by, `I couldn't find a listed game for ${player}.`);
				if (!LO[player].spectators.includes(user)) return Boy.pm(by, "You're not spectating...");
				LO[player].spectators.remove(user);
				Bot.pm(by, `You are no longer spectating ${LO[player].name}'s game... :(`);
				break;
			}
			case 'rejoin': case 'rj': {
				if (args.length) user = toId(args.join(''));
				if (!LO[user]) return Bot.pm(by, `Could not join ${user}'s game.`);
				let header = `<div style="display: inline-block; float: left; font-weight: bold;">My Solution: ${LO[user].soln.length} moves</div><div style="display: inline-block; float: right; font-weight: bold;">Moves Made: ${LO[user].moves.length} moves</div><br /><br /><br />`;
				if (user === toId(by)) return Bot.say(room, `/sendhtmlpage ${by}, Lights Out (${by.substr(1)}), ${header + LO[user].boardHTML(true)}`);
				if (LO[user].spectators.includes(toId(by))) return Bot.say(room, `/sendhtmlpage ${by}, Lights Out (${player}), ${header + LO[player].boardHTML()}`);;
				return Bot.pm(by, "Err, you werent' a spectator there.");
				break;
			}
			case 'forfeit': case 'f': case 'ff': case 'resign': {
				if (!LO[user]) return Bot.pm(by, "Life sometimes throws you a curveball. Doesn't mean you need to forfeit. And definitely not without trying.");
				if (!LO[user].ff) {
					Bot.pm(by, "Are you sure you want to forfeit? If you are, use this again.");
					LO[user].ff = true;
					return;
				}
				Bot.pm(by, "F, ended.");
				// Bot.say(room, `/adduhtml Lights Out @ ${Date.now()}, ${LO[user].boardHTML(false, LO[user].problem)}`);
				// Bot.say(room, `^ solvable in ${LO[user].soln.length} moves.`);
				delete LO[user];
				return;
				break;
			}
		}
	}
}
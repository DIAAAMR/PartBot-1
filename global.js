global.toId = function (text) {
	if (typeof text === 'string') return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

global.toID = function (text) {
	if (typeof text === 'string') return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Am in the process of switching to toID

/**************************
*        Modules          *
**************************/

global.url = require('url');
global.util = require('util');
global.https= require('https');
global.axios = require('axios');
global.levenshtein = require('js-levenshtein');
global.fs = require('fs');
global.config = require('./config.js');
global.tools = require('./data/tools.js');
global.BattleAI = require('./data/BATTLE/ai.js').AI;
global.GAMES = require('./data/GAMES/index.js');


/**************************
*        Storage          *
**************************/

global.queryRoom = '';
global.cooldownObject = {};
global.ignoreRooms = config.ignoreRooms.map(room => room.replace(/[^0-9a-z-]/g, ''));
global.prefix = config.prefix;
global.websiteLink = config.websiteLink;


/**************************
*     Abbreviations       *
**************************/

global.unxa = 'Unexpected number of arguments.';
global.typelist = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'];



/**************************
*          Data           *
**************************/

global.data = {
	pokedex: require('./data/DATA/pokedex.json'),
	items: require('./data/DATA/items.json'),
	moves: require('./data/DATA/moves.json'),
	abilities: false,
	typechart: require('./data/DATA/typechart.js').BattleTypeChart
}

global.data.abilities = [...(new Set(Object.values(data.pokedex).filter(mon => mon.num > 0).map(mon => Object.values(mon.abilities)).reduce((acc, abs) => acc.concat(abs), [])))].sort();
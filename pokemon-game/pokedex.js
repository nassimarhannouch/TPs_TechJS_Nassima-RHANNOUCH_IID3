const pokemons = {
  pikachu: [
    { name: 'Coup', power: 50, acc: 90 },
    { name: 'Éclair', power: 40, acc: 100 },
    { name: 'Foudre', power: 70, acc: 95 },
    { name: 'Petit coup', power: 30, acc: 100 },
    { name: 'Gros coup', power: 80, acc: 85 }
  ],
  bulbasaur: [
    { name: 'tackle', power: 40, acc: 100 },
    { name: 'vine-whip', power: 45, acc: 100 }
  ]
};

let hp = { pikachu: 300, bulbasaur: 300 };

function playerTurn(player, enemy, attackIndex) {
  const attack = pokemons[player][attackIndex];
  console.log(`${player} utilise ${attack.name} !`);

  if (Math.random() * 100 < attack.acc) {
    hp[enemy] -= attack.power;
    console.log(`${enemy} perd ${attack.power} points de vie !`);
  } else {
    console.log(`${player} a raté !`);
  }
}

function enemyTurn(enemy, player) {
  const attack = pokemons[enemy][Math.floor(Math.random() * pokemons[enemy].length)];
  console.log(`${enemy} utilise ${attack.name} !`);

  if (Math.random() * 100 < attack.acc) {
    hp[player] -= attack.power;
    console.log(`${player} perd ${attack.power} points de vie !`);
  } else {
    console.log(`${enemy} a raté !`);
  }
}

function battle(player, enemy, attackIndex) {
  playerTurn(player, enemy, attackIndex);
  if (hp[enemy] > 0) {
    enemyTurn(enemy, player);
  }
  console.log(`\nPoints de vie: ${player}=${hp[player]} | ${enemy}=${hp[enemy]}`);
}

module.exports = { pokemons, hp, battle };

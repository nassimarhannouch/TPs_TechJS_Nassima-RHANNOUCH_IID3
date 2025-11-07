const inquirer = require('inquirer');
const { pokemons, battle, hp } = require('./pokedex');

async function startGame() {

  const { playerPokemon } = await inquirer.prompt([
    {
      type: 'list',
      name: 'playerPokemon',
      message: 'Choisis ton Pokémon:',
      choices: Object.keys(pokemons)
    }
  ]);

  const enemyPokemon = 'bulbasaur';

  console.log(`\nTu joues avec ${playerPokemon} contre ${enemyPokemon}\n`);


  while (hp[playerPokemon] > 0 && hp[enemyPokemon] > 0) {
    const { attackChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'attackChoice',
        message: 'Choisis ton attaque:',
        choices: pokemons[playerPokemon].map((atk, i) => `${i+1}. ${atk.name} (${atk.power})`)
      }
    ]);

    const attackIndex = parseInt(attackChoice.split('.')[0]) - 1;

    battle(playerPokemon, enemyPokemon, attackIndex);
  }

  console.log(hp[playerPokemon] > 0 
    ? `\nBravo ! ${playerPokemon} a gagné ` 
    : `\nDommage ! ${enemyPokemon} a gagné `);
}

startGame();

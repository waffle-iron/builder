import Character from '../lib/character.js';

export default (state = Character.create(), action = {}) => {
  console.log(`[ACTION] ${action.type}:`, action);
  switch(action.type) {
    case 'NAME_CHANGE':
      return Character.create(state, { name: action.name });
    case 'CHARACTER_RACE_CHANGE':
      return state.choose('race', action.race);
    case 'CHARACTER_CLASS_CHANGE':
      return state.choose('gameClass', action.gameClass);
    case 'LEVEL_CHANGE':
      return Character.create(state, { level: action.level });
    case 'CHARACTER_ABILITY_CHANGE':
      let change = { abilities: { [action.ability]: action.value } };
      console.log('character ability change', change);
      return Character.create(state, change);
    default:
      return state;
  }
};

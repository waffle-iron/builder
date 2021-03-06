import React from 'react';
import { connect } from 'react-redux';

import CharacterAbilityStyles from '../../styles/components/character_abilities.scss';
import { setProperty } from '../../actions';

const abilities = ['strength', 'constitution', 'dexterity', 'intelligence', 'wisdom', 'charisma'];

class CharacterAbilities extends React.Component {
  render() {
    const { character, abilityChange } = this.props;
    const abilityScores = abilities.map(ability => (
      <td key={`${ability}score`}>
        <input
          className="ability"
          type="text"
          min={0}
          max={40}
          value={character[ability]}
          onChange={evt => abilityChange(ability, evt.target.value)} />
      </td>
    ));
    const abilityModifiers = abilities.map(ability => (
      <td key={`${ability}mod`}>
        <input
          className="ability"
          type="text"
          value={character[`${ability}Mod`]}
          disabled={true} />
      </td>
    ));
    const abilityModifiersPlusLevel = abilities.map(ability => (
      <td key={`${ability}modlevel`}>
        <input
          className="ability"
          type="text"
          value={character[`${ability}ModPlusLevel`]}
          disabled={true} />
      </td>
    ));
    return (
      <div className={CharacterAbilityStyles.characterAbilities}>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>str</th>
              <th>con</th>
              <th>dex</th>
              <th>int</th>
              <th>wis</th>
              <th>cha</th>
            </tr>
          </thead>
          <tbody>
            <tr className="editable">
              <th></th>
              {abilityScores}
            </tr>
            <tr className="computed">
              <th>
                <div>modifier</div>
              </th>
              {abilityModifiers}
            </tr>
            <tr className="computed output">
              <th>
                <div>
                modifier + level
                </div>
              </th>
              {abilityModifiersPlusLevel}
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} />
              <td className="tab">initiative</td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    character: state.character,
  }
);

const mapDispatchToProps = dispatch => (
  {
    abilityChange: (ability, value) => {
      const score = Number.isInteger(parseInt(value, 10)) ? parseInt(value, 10) : 0;
      dispatch(setProperty(ability, score));
    },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CharacterAbilities);

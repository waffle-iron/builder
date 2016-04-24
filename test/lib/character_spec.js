import Character, { combineModifiers, removeModifiers } from '../../src/lib/character.js';

describe('Character', () => {
  describe('#constructor', () => {
    it('sets default base strength ability score of 8', () => {
      expect((new Character())._strength).to.eq(8);
    });
    it('sets default base dexterity ability score of 8', () => {
      expect((new Character())._dexterity).to.eq(8);
    });
    it('sets default base constitution ability score of 8', () => {
      expect((new Character())._constitution).to.eq(8);
    });
    it('sets default base intelligence ability score of 8', () => {
      expect((new Character())._intelligence).to.eq(8);
    });
    it('sets default base wisdom ability score of 8', () => {
      expect((new Character())._wisdom).to.eq(8);
    });
    it('sets default base charisma ability score of 8', () => {
      expect((new Character())._charisma).to.eq(8);
    });
    it('has a blank default name', () => {
      expect((new Character()).name).to.eq('');
    });
    it('has a default level of 1', () => {
      expect((new Character()).level).to.eq(1);
    });
    it('has a blank class by default', () => {
      expect((new Character()).gameClass).to.eq(null);
    });
    it('has empty modifiers for each ability', () => {
      expect(Character.create().modifiers.strength).to.deep.eq([]);
    });

    it('has choices', () => {
      expect(Character.create().choices.length).to.not.eq(0);
    });

    context('when passing another character and diff properties', () => {
      it('returns a new character with updated properties', () => {
        let initialCharacter = Character.create();
        let otherCharacter = new Character(initialCharacter, { name: 'Byron' });
        expect(otherCharacter.name).to.eq('Byron');
      });
    });
  });

  describe('#choose', () => {
    it('makes a choice and implements the consequences', () => {
      expect(Character.create().choose('+2 strength or dex', 'strength').strength).to.eq(10);
    });

    it('registers that choice and the chosen option', () => {
      expect(
        Character.create()
          .choose('+2 strength or dex', 'strength')
          .chosenChoices['+2 strength or dex']
        ).to.eq('strength');
    });

    it("doesn't override different choices", () => {
      let character = Character.create()
        .choose('+2 strength or dex', 'strength')
        .choose('+2 wisdom or dex', 'wisdom');

      expect(character.strength).to.eq(10);
      expect(character.wisdom).to.eq(12);
    });

    it('can make choices that affect the same property', () => {
      let character = Character.create()
        .choose('+2 strength or dex', 'dexterity')
        .choose('+2 wisdom or dex', 'dexterity');

      expect(character.dexterity).to.eq(14);
    });

    it('choices can have multiple consequences', () => {
      let character = Character.create()
        .choose('+2 strength or dex', 'strength');
      expect(character.strength).to.eq(10);
      expect(character.charisma).to.eq(3);
    });

    it('can be made again and overrides old choice', () => {
      let character = Character.create()
        .choose('+2 strength or dex', 'dexterity')
        .choose('+2 strength or dex', 'strength');

      expect(character.strength).to.eq(10);
      expect(character.dexterity).to.eq(8);
    });

    context('when the consequence of a choice is to set the value of a property', () => {
      it('sets the value', () => {
        expect(Character.create().choose('class', 'barbarian').gameClass).to.eq('Barbarian');
      });
    });

    it('throws an error if given an invalid choice name', () => {
      expect(() => {
        Character.create().choose('bogus', 'blarg');
      }).to.throw(Error);
    });
  });

  describe('#unmakeChoice', () => {
    it('can unmake a decision, reverting the consequences', () => {
      let character = Character.create().choose('+2 strength or dex', 'strength');
      expect(character.unmakeChoice('+2 strength or dex').strength).to.eq(8);
    });

    it('de-registers that choice and the chosen option', () => {
      expect(
        Character.create()
          .choose('+2 strength or dex', 'strength')
          .unmakeChoice('+2 strength or dex')
          .chosenChoices['+2 strength or dex']
        ).to.eq(null);
    });

    context('when the consequence of a choice is to set the value of a property', () => {
      context('and the consequence has an unset property', () => {
        it('sets the value to the unset', () => {
          expect(
            Character.create()
              .choose('class', 'barbarian')
              .unmakeChoice('class')
              .gameClass
            ).to.eq('');
        });
      });
    });

    it('throws an error if given an invalid choice name', () => {
      expect(() => {
        Character.create().unmakeChoice('bogus');
      }).to.throw(Error);
    });
  });
});

describe('combineModifiers', () => {
  describe('it takes the modifiers of a character and an array of new modifiers', () => {
    it('returns a new modifiers object with new modifiers added', () => {
      let character = Character.create().choose('+2 strength or dex', 'strength');
      let newModifiers = [
        { field: 'dexterity', modifier: (dex) => { return dex + 5; } }
      ];
      let combinedModifiers = combineModifiers(character.modifiers, newModifiers);
      expect(combinedModifiers.strength.length).to.eq(1);
      expect(combinedModifiers.dexterity.length).to.eq(1);
    });
  });
});

describe('removeModifiers', () => {
  describe('it takes the modifiers of a character an array of new modifiers', () => {
    it('returns a new modifiers object with modifiers removed', () => {
      let character = Character.create().choose('+2 strength or dex', 'strength');
      let revertedModifiers = [
        { field: 'strength', modifier: character.modifiers.strength[0] }
      ];
      let remainingModifiers = removeModifiers(character.modifiers, revertedModifiers);
      expect(remainingModifiers.strength.length).to.eq(0);
    });
  });
});

import StringUtil from '../../utils/StringUtil';

const util = new StringUtil();

describe('Method normalize', () => {
  it('should normalize strings with accents', () => {
    const words = ['dicionário', 'caminhão', 'cônjuge', 'à'];
    const normalizedWords = words.map(word => util.normalize(word));

    const [dictionary, truck, spouse, letter] = normalizedWords;

    expect(dictionary).toBe('dicionario');
    expect(truck).toBe('caminhao');
    expect(spouse).toBe('conjuge');
    expect(letter).toBe('a');
  });

  it('should remove white spaces', () => {
    const words = ['hello   ', '  world', '   again  '];

    const normalizedWords = words.map(word => util.normalize(word));
    const expectedWords = words.map(word => word.trim());

    expect(normalizedWords).toEqual(expectedWords);
  });
});

describe('Method likeMatch', () => {
  const word = 'hello world';

  it('should return true for all possible matches', () => {
    const possibleMatches = [
      'hello world',
      'hello',
      'world',
      'hel',
      'he',
      'llo',
      'wo',
      'worl',
      'or',
      'llo wor',
    ];

    possibleMatches.forEach(query =>
      expect(util.likeMatch(word, query)).toBe(true)
    );
  });

  it('should return false for all strings', () => {
    const queries = [
      '123',
      'hello world again',
      'world again',
      'world hello',
      'www',
      'ellou',
    ];

    queries.forEach(query => expect(util.likeMatch(word, query)).toBe(false));
  });
});

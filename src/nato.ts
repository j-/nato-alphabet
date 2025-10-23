export const ALPHABET = new Map([
  ['a', 'Alfa'],
  ['b', 'Bravo'],
  ['c', 'Charlie'],
  ['d', 'Delta'],
  ['e', 'Echo'],
  ['f', 'Foxtrot'],
  ['g', 'Golf'],
  ['h', 'Hotel'],
  ['i', 'India'],
  ['j', 'Juliett'],
  ['k', 'Kilo'],
  ['l', 'Lima'],
  ['m', 'Mike'],
  ['n', 'November'],
  ['o', 'Oscar'],
  ['p', 'Papa'],
  ['q', 'Quebec'],
  ['r', 'Romeo'],
  ['s', 'Sierra'],
  ['t', 'Tango'],
  ['u', 'Uniform'],
  ['v', 'Victor'],
  ['w', 'Whiskey'],
  ['x', 'X-ray'],
  ['y', 'Yankee'],
  ['z', 'Zulu'],
]);

export const DIGITS = new Map([
  ['0', 'Zero'],
  ['1', 'One'],
  ['2', 'Two'],
  ['3', 'Three'],
  ['4', 'Four'],
  ['5', 'Five'],
  ['6', 'Six'],
  ['7', 'Seven'],
  ['8', 'Eight'],
  ['9', 'Niner'],
  ['.', 'Decimal'],
  ['100', 'Hundred'],
  ['1000', 'Thousand'],
]);

const total = ALPHABET.size + DIGITS.size;
let i = 0;

export const COLORS = new Map([
  ['a', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['b', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['c', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['d', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['e', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['f', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['g', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['h', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['i', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['j', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['k', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['l', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['m', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['n', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['o', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['p', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['q', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['r', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['s', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['t', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['u', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['v', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['w', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['x', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['y', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['z', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['0', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['1', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['2', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['3', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['4', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['5', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['6', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['7', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['8', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['9', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['.', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['100', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
  ['1000', `hsla(${360 * (i++ / total)}, 80%, 80%, 50%)`],
]);

export enum NatoType {
  UNKNOWN,
  ALPHABET,
  DIGIT,
}

export const getNatoCharacterDetails = (input: string) => {
  if (ALPHABET.has(input)) {
    return [
      NatoType.ALPHABET,
      ALPHABET.get(input)!,
      COLORS.get(input)!,
    ] as const;
  }

  if (DIGITS.has(input)) {
    return [
      NatoType.DIGIT,
      DIGITS.get(input)!,
      COLORS.get(input)!,
    ] as const;
  }

  return [NatoType.UNKNOWN] as const;
};

export const getNatoPayloadDetails = (input: string) => {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9.\s\n]+/g, ' ')
    .trim()
    .split(' ')
    .filter((str) => str)
    .map((word) => ({
      input: word,
      output: (word.match(/1000(?!\d)|100(?!\d)|./g) ?? [])
        .map(getNatoCharacterDetails)
        .filter((char) => char != null)
    }));
};

export type NatoPayloadDetails = ReturnType<
  typeof getNatoPayloadDetails
>;

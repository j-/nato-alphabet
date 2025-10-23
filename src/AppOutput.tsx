import { type FC } from 'react';
import { StrongFirstChar } from './StrongFirstChar';
import {
  NatoType,
  type NatoCharacterDetails,
  type NatoPayloadDetails,
  type NatoWordDetails,
} from './nato';

export type AppOutputProps = {
  output: NatoPayloadDetails;
};

export const AppOutput: FC<AppOutputProps> = ({ output }) => (
  <ol>
    {output.map((word, i) => (
      <AppOutputWord key={i} word={word} />
    ))}
  </ol>
);

type AppOutputWordProps = {
  word: NatoWordDetails;
};

const AppOutputWord: FC<AppOutputWordProps> = ({ word }) => (
  <li>
    <p style={{
      fontVariant: 'small-caps',
    }}>
      {word.input}
    </p>

    <div style={{
      fontSize: '1.25em',
      lineHeight: '1.5em',
    }}>
      {word.output.map((char, i) => (
        char[0] === NatoType.UNKNOWN ? null : [
          <AppOutputChar key={`${i}-${char}`} char={char} />,
          ' ',
        ]
      ))}
    </div>
  </li>
);

type AppOutputCharProps = {
  char: NatoCharacterDetails;
};

const AppOutputChar: FC<AppOutputCharProps> = ({ char }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '0.25em',
      borderRadius: '0.25em',
      backgroundColor: char[2],
      lineHeight: '0.75em',
    }}
  >
    {
      char[0] === NatoType.ALPHABET ?
        <StrongFirstChar children={char[1]} /> :
        <span>{char[1]}</span>
    }
  </span>
);

import ClearIcon from '@mui/icons-material/Clear';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  type FC,
  type FormEventHandler,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { getNatoPayloadDetails, type NatoPayloadDetails } from './nato';
import { AppOutput } from './AppOutput';

/** Don't auto-focus the main input if in an iframe. */
const shouldAutoFocus = window.parent === window;

/** Query param to read/write. */
const paramInput = 'input';

/** Get the value of {@link paramInput}. */
const getCurrentParamValue = () => {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(paramInput);
  return value;
};

/** The value of {@link paramInput} on page load. */
const initialInputValue = getCurrentParamValue();

/** Initialize the output if there is input on page load. */
const initialOutputValue = (() => {
  // TODO: Use history.state if available.
  // TODO: Replace history.state when input exists in URL.
  return initialInputValue ?
    getNatoPayloadDetails(initialInputValue) :
    null;
})();

export const App: FC = () => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [cleanInput, setCleanInput] = useState('');
  const [output, setOutput] = useState<NatoPayloadDetails | null>(initialOutputValue);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = formData.get('input') as string;
    if (
      // Input cannot be blank.
      input &&
      // Input must have changed.
      input !== cleanInput &&
      // Input must not already be in URL.
      input !== getCurrentParamValue()
    ) {
      setCleanInput(input);
      const output = getNatoPayloadDetails(input);
      setOutput(output);
      const url = new URL(window.location.href);
      url.searchParams.set(paramInput, input);
      console.count('pushstate');
      history.pushState({ input, output }, '', url.toString());
    }
  }, [cleanInput]);

  useEffect(() => {
    const handler = (e: PopStateEvent) => {
      console.log(e.type, e.state);
      if (e.state) {
        inputRef.current!.value = e.state.input;
        setOutput(e.state.output as NatoPayloadDetails);
      } else {
        inputRef.current!.value = '';
        setOutput(null);
      }
    };
    window.addEventListener('popstate', handler);
    return () => {
      window.removeEventListener('popstate', handler);
    };
  }, []);

  useEffect(() => {
    if (initialInputValue) {
      inputRef.current!.value = initialInputValue;
    }
  }, []);

  return (
    <Box m={2} mx="auto" p={2} maxWidth="80ch">
      <Typography component="h1" variant="h3">Nato alphabet</Typography>

      <Box component="form" my={4} onSubmit={handleSubmit}>
        <Stack gap={2}>
          <TextField
            type="text"
            multiline
            id={`${id}-input`}
            name="input"
            defaultValue=""
            autoComplete="off"
            autoCorrect="off"
            autoFocus={shouldAutoFocus}
            placeholder="Type here"
            enterKeyHint="done"
            onBlur={(e) => {
              e.currentTarget.form?.requestSubmit();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (e.metaKey || e.shiftKey) {
                  document.execCommand('insertText', undefined, '\n');
                } else {
                  e.currentTarget.closest('form')?.requestSubmit();
                }
              }
            }}
            slotProps={{
              htmlInput: {
                ref: inputRef,
              },
              input: {
                endAdornment: (
                  <IconButton
                    type="reset"
                    onClick={() => {
                      inputRef.current?.focus();
                      setCleanInput('');
                      setOutput(null);
                    }}
                    sx={{
                      alignSelf: 'start',
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                ),
              },
            }}
          />

          <Button
            type="submit"
            size="large"
            variant="contained"
          >
            Translate
          </Button>
        </Stack>

        {output && (
          <Box component="output" display="block" my={4} htmlFor={`${id}-input`}>
            <AppOutput output={output} />
          </Box>
        )}
      </Box>
    </Box>
  )
};

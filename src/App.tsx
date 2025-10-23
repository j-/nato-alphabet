import ClearIcon from '@mui/icons-material/Clear';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FC,
  type FormEventHandler,
} from 'react';
import { AppOutput } from './AppOutput';
import {
  getCurrentParamValue,
  initAppState,
  pushAppState,
  type AppState,
} from './app-state';
import { getNatoPayloadDetails } from './nato';

/** Don't auto-focus the main input if in an iframe. */
const shouldAutoFocus = window.parent === window;

export const App: FC = () => {
  const id = useId();

  const inputRef = useRef<HTMLInputElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  const [appState, setAppState] = useState<AppState | null>(initAppState);
  const { input: cleanInput, output } = appState ?? { output: null };

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
      console.log('handleSubmit() pushstate', { input, cleanInput });
      const output = getNatoPayloadDetails(input);
      const appState: AppState = { input, output, };
      setAppState(appState);
      pushAppState(appState);
    }
  }, [cleanInput]);

  useEffect(() => {
    const handler = (e: PopStateEvent) => {
      if (e.state) {
        const appState: AppState = {
          input: e.state.input,
          output: e.state.output,
        };
        setAppState(appState);
      } else {
        const appState: AppState = {
          input: '',
          output: null,
        };
        setAppState(appState);
      }
    };
    window.addEventListener('popstate', handler);
    return () => {
      window.removeEventListener('popstate', handler);
    };
  }, []);

  useEffect(() => {
    if (cleanInput) {
      inputRef.current!.value = cleanInput;
    }
  }, [cleanInput]);

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
              // Ignore blur due to clicking the reset button.
              if (e.relatedTarget === resetButtonRef.current) return;
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
                    ref={resetButtonRef}
                    type="reset"
                    onClick={() => {
                      inputRef.current?.focus();
                      const appState: AppState = {
                        input: '',
                        output: null,
                      };
                      setAppState(appState);
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

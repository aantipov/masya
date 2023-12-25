import { createSignal, on, onMount } from 'solid-js';
import Clerk from '@clerk/clerk-js';
import { shadesOfPurple } from '@clerk/themes';
import { makePrototypeMutation } from './queries/prototype';

const [getClerk, setClerk] = createSignal<Clerk>();
const [getClerkLoaded, setClerkLoaded] = createSignal(false);
export const useClerk = (clerkPKey?: string) => {
  // the key is provided only on the first call to initialize clerk
  if (clerkPKey) {
    onMount(() => {
      const clerkInstance = new Clerk(clerkPKey);
      setClerk(clerkInstance);
      async function loadClerk() {
        await clerkInstance.load({
          appearance: {
            baseTheme: shadesOfPurple,
            layout: {
              showOptionalFields: true,
              socialButtonsPlacement: 'bottom',
              socialButtonsVariant: 'iconButton',
            },
          },
        });
        setClerkLoaded(true);
      }
      loadClerk();
    });
  }
  return { getClerk, getClerkLoaded };
};

const [_getUserAPIKey, _setUserAPIKey] = createSignal('');
const setUserAPIKey = (key: string) => {
  window.sessionStorage.setItem('openai-key', key);
  _setUserAPIKey(key);
};
let userAPIKeyInitialized = false;
export function useUserAPIKey() {
  const sessionStorageKey = 'openai-key';
  if (!userAPIKeyInitialized) {
    _setUserAPIKey(window.sessionStorage.getItem(sessionStorageKey) || '');
    userAPIKeyInitialized = true;
  }
  return [_getUserAPIKey, setUserAPIKey] as const;
}

const [getPrototypeStream, setPrototypeStream] = createSignal<string>('');
const [lastPrototype, setLastPrototype] = createSignal<string>('');
let prototypeM: ReturnType<typeof makePrototypeMutation>;
export function usePrototypeM() {
  if (!prototypeM) {
    prototypeM = makePrototypeMutation(setLastPrototype, setPrototypeStream);
  }
  return { prototypeM, lastPrototype, getPrototypeStream } as const;
}

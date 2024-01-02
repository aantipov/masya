import { createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
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

// Messages list
export interface MessageT {
  prompt: string;
  response: string;
  isFinished: boolean;
}

interface MsgStoreT {
  messages: MessageT[];
  response: string; // Last response
  isFinished: boolean; // Last message is finished
}

const [msgStore, setMsgStore] = createStore<MsgStoreT>({
  messages: [],
  get response() {
    return this.messages.at(-1)?.response || '';
  },
  get isFinished() {
    return !!this.messages.at(-1)?.finished;
  },
});

const addPrompt = (prompt: string) => {
  setMsgStore('messages', msgStore.messages.length, {
    prompt,
    response: '',
    isFinished: false,
  });
};
const setResponse = (response: string, isFinished = false) => {
  setMsgStore('messages', msgStore.messages.length - 1, 'response', response);
  setMsgStore(
    'messages',
    msgStore.messages.length - 1,
    'isFinished',
    isFinished,
  );
};
export function useMessages() {
  return {
    messages: msgStore.messages,
    msgStore,
    addPrompt,
    setResponse,
  } as const;
}

let prototypeM: ReturnType<typeof makePrototypeMutation>;
export function usePrototypeM() {
  if (!prototypeM) {
    prototypeM = makePrototypeMutation();
  }
  return { prototypeM } as const;
}

// Global Notification
export const [notify, setNotify] = createSignal({ text: '' });

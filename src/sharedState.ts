import { createSignal } from 'solid-js';
import Clerk from '@clerk/clerk-js';

export const [getClerk, setClerk] = createSignal<Clerk>();
export const [getClerkLoaded, setClerkLoaded] = createSignal(false);

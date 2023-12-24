import { getClerk, getClerkLoaded } from '@/sharedState';
import { createEffect } from 'solid-js';

export default function UserInfoIcon() {
  let userIconRef: HTMLDivElement;

  createEffect(() => {
    const clerk = getClerk();
    const isClerkLoaded = getClerkLoaded();
    if (isClerkLoaded && clerk?.user) {
      clerk.mountUserButton(userIconRef);
    }
  });

  return <div ref={(el) => (userIconRef = el)}></div>;
}

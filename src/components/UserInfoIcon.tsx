import { useClerk } from '@/sharedState';
import { createEffect } from 'solid-js';

export default function UserInfoIcon() {
  let userIconRef: HTMLDivElement;
  const { getClerk, getClerkLoaded } = useClerk();

  createEffect(() => {
    const clerk = getClerk();
    if (getClerkLoaded() && clerk?.user) {
      clerk.mountUserButton(userIconRef);
    }
  });

  return <div ref={(el) => (userIconRef = el)}></div>;
}

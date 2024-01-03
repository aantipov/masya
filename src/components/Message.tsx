import 'solid-devtools/setup';
import Preview from './Preview';
import { useClerk, type MessageT } from '@/sharedState';
import { Show } from 'solid-js';
import clsx from 'clsx/lite';
import logo from '@/images/logo.png';

interface Props {
  item: MessageT;
}

export default function Message({ item }: Props) {
  const { getClerk } = useClerk();
  const imgUrl = () => getClerk()?.user?.imageUrl;

  return (
    <div class="text-gray-100">
      <div>
        <div class="flex font-bold">
          <Show when={!!imgUrl()}>
            <img
              src={imgUrl()}
              width="24"
              height="24"
              alt=""
              class="mr-2 rounded-full"
            />
          </Show>
          <div>You</div>
        </div>
        <div class={clsx(!!imgUrl() && 'pl-8')}>{item.prompt}</div>
      </div>
      <div class="pt-2">
        <div class="mb-1 flex">
          <img
            src={logo.src}
            width="24"
            height="24"
            class="mr-2 rounded-full"
          />
          <div class="font-bold">Masya</div>
        </div>
        <Preview message={item} />
      </div>
    </div>
  );
}

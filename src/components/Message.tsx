import 'solid-devtools/setup';
import Preview from './Preview';
import { type MessageT } from '@/sharedState';

interface Props {
  item: MessageT;
}

export default function Message({ item }: Props) {
  return (
    <div class="text-gray-100">
      <div>
        <div class="font-bold">You</div>
        <div>{item.prompt}</div>
      </div>
      <div class="pt-2">
        <div class="font-bold">Masya</div>
        <Preview message={item} />
      </div>
    </div>
  );
}

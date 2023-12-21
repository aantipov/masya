import { Show, type Component, type JSX } from 'solid-js';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children: JSX.Element;
}

const Button: Component<ButtonProps> = (props) => {
  return (
    <>
      <Show when={!props.disabled}>
        <button
          type={props.type || 'button'}
          class={`w-full rounded bg-indigo-600 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none hover:bg-indigo-500 hover:bg-indigo-700 hover:shadow-lg focus:outline-none active:bg-indigo-700 ${props.className}`}
          onClick={props.onClick}
        >
          {props.children}
        </button>
      </Show>
      <Show when={!!props.disabled}>
        <button
          type={props.type || 'button'}
          class="w-full cursor-not-allowed rounded bg-gray-800 px-6 py-3 text-sm font-bold uppercase text-gray-400 shadow focus:outline-none disabled:shadow-none"
          disabled
        >
          {props.children}
        </button>
      </Show>
    </>
  );
};

export default Button;

import 'solid-devtools/setup';

export default function App() {
  return (
    <>
      <div id="promptsHistory" class="flex-grow space-y-6 overflow-y-auto p-8">
        {/* <!-- Example Prompts (Clickable and Responsive) --> */}
        {/* <!-- Previous prompts here... --> */}
        <div
          class="prompt cursor-pointer rounded bg-gray-600 p-4 text-white hover:bg-gray-700"
          onclick="displayUI(1)"
        >
          <p>User: Create a header with navigation links...</p>
          <a href="#" class="text-sm text-blue-500 hover:text-blue-700">
            Expand
          </a>
        </div>
        <div
          class="prompt cursor-pointer rounded bg-gray-600 p-4 text-white hover:bg-gray-700"
          onclick="displayUI(2)"
        >
          <p>User: Add a responsive sidebar</p>
        </div>
        <div
          class="prompt cursor-pointer rounded bg-gray-600 p-4 text-white hover:bg-gray-700"
          onclick="displayUI(3)"
        >
          <p>User: Design a user profile card...</p>
          <a href="#" class="text-sm text-blue-500 hover:text-blue-700">
            Expand
          </a>
        </div>
        <div
          class="prompt cursor-pointer rounded bg-gray-600 p-4 text-white hover:bg-gray-700"
          onclick="displayUI(4)"
        >
          <p>User: Implement a photo gallery grid</p>
        </div>
        <div
          class="prompt cursor-pointer rounded bg-gray-600 p-4 text-white hover:bg-gray-700 hover:shadow-md"
          onclick="displayUI(5)"
        >
          <p>User: Build a contact form with validation...</p>
          <a href="#" class="text-sm text-blue-500 hover:text-blue-700">
            Expand
          </a>
        </div>
        <div
          class="prompt cursor-pointer rounded bg-gray-600 p-4 text-white hover:border hover:border-gray-400 hover:bg-gray-700"
          onclick="displayUI(6)"
        >
          <p>User: Create a footer with social media links</p>
        </div>
        <div
          class="prompt cursor-pointer rounded bg-gray-700 p-4 text-white"
          onclick="displayUI(7)"
        >
          <p>User: Add a modal for newsletter subscription...</p>
          <a href="#" class="text-sm text-blue-500 hover:text-blue-700">
            Expand
          </a>
        </div>
        {/* <!-- The last prompt with special highlighting to indicate selection --> */}
        <div
          class="prompt cursor-pointer rounded bg-gray-600 p-4 text-white hover:border hover:border-gray-400 hover:bg-gray-500"
          onclick="displayUI(8)"
        >
          <p>User: Implement a dark mode toggle feature</p>
        </div>
      </div>
      {/* Fixed Input Area for New Prompt */}
      <div class="bg-gray-800 p-8">
        <textarea
          id="userInput"
          class="h-200px w-full rounded border border-gray-600 bg-gray-900 p-2 text-white"
          placeholder="Describe your UI or changes..."
        ></textarea>
        <button
          id="sendInput"
          class="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </>
  );
}

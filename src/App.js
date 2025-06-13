import { useState } from "react";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add user's message to the chat
    const updatedMessages = [...messages, { sender: "user", text: trimmedInput }];
    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: trimmedInput,
      });

      const botReply = response.data?.reply || "No response from server.";
      setMessages([...updatedMessages, { sender: "bot", text: botReply }]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        {
          sender: "bot",
          text: "❌ Sorry, something went wrong while contacting the server.",
        },
      ]);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 p-4 sm:p-6 md:p-8 flex flex-col">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-lg flex flex-col overflow-hidden h-full">
        {/* Header */}
        <header className="bg-blue-500 text-white text-center p-4 text-xl sm:text-2xl font-semibold">
          🏠 Real Estate Chatbot
        </header>

        {/* Chat Messages */}
        <main className="flex-1 p-4 bg-gray-50 overflow-y-auto space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[85%] sm:max-w-xl p-3 rounded-lg shadow-md break-words transition-all ${
                msg.sender === "user"
                  ? "ml-auto bg-blue-200 text-right"
                  : "mr-auto bg-gray-300 text-left"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </main>

        {/* Input Box */}
        <footer className="bg-white p-4 border-t flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 p-3 rounded-md sm:rounded-l-md sm:rounded-r-none outline-none text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-blue-400"
            placeholder="Ask about properties (e.g., 2BHK in Pune under 40L)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md sm:rounded-r-md sm:rounded-l-none shadow-md transition font-medium"
          >
            Send
          </button>
        </footer>
      </div>
    </div>
  );
};

export default App;

import React, { useState } from 'react';

const PokemonChatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { text: 'Sorry, there was an error processing your request.', isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-4 text-indigo-300">Pokémon Chat</h3>
      <div className="flex-grow overflow-y-auto mb-4 p-2 border border-gray-700 rounded-lg bg-gray-800">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              {message.text}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-center">
            <span className="inline-block p-2 rounded-lg bg-gray-700 text-gray-300">Thinking...</span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Pokémon..."
          className="flex-grow px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default PokemonChatbot;
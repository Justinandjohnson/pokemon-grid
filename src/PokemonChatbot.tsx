import React, { useState } from 'react';
import axios from 'axios';

interface Message {
  text: string;
  isUser: boolean;
}

export function PokemonChatbot() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage: Message = { text: question, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, {
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        temperature: 0.7,
        system: "You are a helpful assistant knowledgeable about Pokemon. Answer the user's question to the best of your ability.",
        messages: [
          { role: "user", content: question }
        ]
      });

      const botMessage: Message = { text: response.data.content[0].text, isUser: false };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching answer:', error);
      const errorMessage: Message = { text: 'Sorry, I couldn\'t get an answer. Please try again.', isUser: false };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
    setIsLoading(false);
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
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
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
}
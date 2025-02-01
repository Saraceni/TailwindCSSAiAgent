'use client';

import { useChat } from 'ai/react';

import { UserCard } from '@/components/ui/userCard';
import { BotCard } from '@/components/ui/botCard';

const ExampleQuestions = [
  'How to use CSS variables with Tailwind CSS?',
  'How to use calc() in tailwind CSS?',
  'How to vertical align with Tailwind CSS across full screen div?',
  'How do I use text-overflow: ellipsis?',
]

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({ maxSteps: 4 });

  return (
    <div className="flex flex-col md:w-full lg:max-w-screen-md lg:mx-auto justify-center items-center w-full py-24 stretch">
      <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            {m.role === 'user' ? <UserCard message={m} /> : <BotCard message={m} />}
          </div>
        ))}
      </div>
      <form onSubmit={(event) => { handleSubmit(event); }} className="fixed bottom-0 w-full md:max-w-screen-sm lg:max-w-screen-md p-2 mb-8 border border-gray-300 bg-white rounded shadow-xl flex items-center">
        <input
          className="w-full p-2"
          value={input}
          placeholder="Ask me something about Tailwind CSS v3 Documentation..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
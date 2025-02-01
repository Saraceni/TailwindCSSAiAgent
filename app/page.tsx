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
    <div className="flex flex-col px-2 w-screen h-screen justify-center items-start stretch overflow-hidden">
      <div className="space-y-4 overflow-y-auto pt-2 pb-24 w-full">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            {m.role === 'user' ? <UserCard message={m} /> : <BotCard message={m} />}
          </div>
        ))}
      </div>
      <form onSubmit={(event) => { handleSubmit(event); }} className="fixed bottom-0 right-1 left-1 md:mx-auto md:max-w-screen-sm lg:max-w-screen-md p-2 mb-4 md:mb-8 border border-gray-300 bg-white rounded shadow-xl flex items-center">
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
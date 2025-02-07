'use client';

import { useChat } from 'ai/react';

import { UserCard } from '@/components/ui/userCard';
import { BotCard } from '@/components/ui/botCard';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';
import Image from 'next/image';

const ExampleQuestions = [
  'How to use CSS variables with Tailwind CSS?',
  'How to use calc() in tailwind CSS?',
  'How to vertical align with Tailwind CSS across full screen div?',
  'How do I use text-overflow: ellipsis?',
]

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({ maxSteps: 5 });

  return (
    <div className="flex flex-col w-screen h-screen stretch overflow-hidden bg-[url('/background_full.jpg')] bg-cover bg-center relative">
      <div className='flex flex-col justify-center items-start bg-white bg-opacity-30 h-full'>
        <div className="flex flex-col justify-center items-center w-full p-4 space-y-1 shadow-lg z-2 relative bg-[#74859744]">
          <h1 className="font-gabarito text-2xl md:text-3xl font-bold text-black">Tailwind CSS AI Agent</h1>
          <p className="font-afacad text-[#232323] text-center">Ask Tailwind CSS v3 or v4 documentation and get answers in seconds. If you don&apos;t specify the version, I&apos;ll use the latest version (v4).</p>
        </div>
        <div className="space-y-4 overflow-y-auto px-3 md:px-2 pt-4 pb-24 w-full flex-1 z-2">
          <div className='bg-gray-200 rounded-md p-4 border border-gray-300 overflow-x-auto opacity-90'>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full mr-2 flex items-center justify-center"><Image src='/bot_icon.png' alt='logo' width={32} height={32} /></div>
              <div className="font-bold">AI</div>
            </div>
            <p className="font-afacad text-lg">Hello, I&apos;m your Tailwind CSS AI Agent. How can I help you today?</p>
          </div>
          {messages.map(m => (
            <div key={m.id} className="whitespace-pre-wrap z-2">
              {m.role === 'user' ? <UserCard message={m} /> : <BotCard message={m} />}
            </div>
          ))}
          {messages.length === 0 && ExampleQuestions.map(q => (
            <div key={q} className="whitespace-pre-wrap z-2 bg-[#474d5dcc] rounded-md p-[10px] text-[#ababab] text-center shadow-md cursor-pointer" onClick={() => append({ role: 'user', content: q })}>
              {q}
            </div>
          ))}
        </div>
        <form onSubmit={(event) => { handleSubmit(event); }} className="fixed bottom-0 right-2 left-2 md:mx-auto md:max-w-screen-sm lg:max-w-screen-md p-2 mb-4 md:mb-8 border border-gray-300 bg-white rounded-md shadow-xl flex items-center">
          <input
            className="w-full p-2"
            value={input}
            placeholder="Type your question here..."
            onChange={handleInputChange}
          />
          <button type="submit" className="ml-2 p-2 bg-black text-white rounded hover:bg-gray-800">
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
}

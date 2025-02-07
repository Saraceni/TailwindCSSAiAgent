import { Message } from 'ai';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { PiCoffeeFill } from "react-icons/pi";
import { SlDocs } from "react-icons/sl";

export const BotCard = ({ message }: { message: Message }) => {
    return <div className='bg-gray-200 opacity-90 rounded-md p-4 border border-gray-300 overflow-x-auto'>
        <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full mr-2 flex items-center justify-center"><Image src='/bot_icon.png' alt='logo' width={32} height={32} /></div>
            <div className="font-bold">AI</div>
        </div>
        <ReactMarkdown className="font-afacad text-lg">{message.content}</ReactMarkdown>
        {!!message?.toolInvocations?.length && message.toolInvocations.some(toolInvocation => toolInvocation.toolName === 'searchTailwindDocsV3') && message.content.length === 0 && <div className='flex items-center space-x-2'>
            <span className="italic font-light font-afacad text-lg">Let me get back to you with the answer while I drink my coffee and read the documentation of Tailwind CSS v3...</span><PiCoffeeFill className='flex-shrink-0' color='#717171' />
        </div>}
        {!!message?.toolInvocations?.length && message.toolInvocations.some(toolInvocation => toolInvocation.toolName === 'searchTailwindDocsV4') && message.content.length === 0 && <div className='flex items-end space-x-2 relative'>
            <span className="italic font-light font-afacad text-lg">Let me just check the documentation of Tailwind CSS v4.0 while I drink my coffee...</span><PiCoffeeFill className='flex-shrink-0' size={20} color='black' />
        </div>}
        {!!message?.toolInvocations?.length && message.toolInvocations.some(toolInvocation => toolInvocation.toolName === 'searchUpgradeGuide') && message.content.length === 0 && <div className='flex items-center space-x-2'>
            <span className="italic font-light font-afacad text-lg">Im just gonna check the upgrade guide to be sure my answer is correct.</span><SlDocs className='flex-shrink-0' color='#717171' />
        </div>}
        <div>
            {message?.experimental_attachments
                ?.filter(attachment =>
                    attachment?.contentType?.startsWith('image/'),
                )
                .map((attachment, index) => {
                    if (attachment?.contentType?.startsWith('image/')) {
                        return <Image
                            key={`${message.id}-${index}`}
                            src={attachment.url}
                            width={500}
                            height={500}
                            alt={attachment.name ?? `attachment-${index}`}
                        />
                    } else {
                        return <div key={`${message.id}-${index}`} className='w-[500px] h-[500px] bg-gray-200'>{attachment.name}</div>
                    }
                })}
        </div>
    </div>
}
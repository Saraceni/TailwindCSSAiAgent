import { Message } from 'ai';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { FaRobot } from "react-icons/fa";
import { PiCoffeeFill } from "react-icons/pi";

export const BotCard = ({ message }: { message: Message }) => {
    return <div className='bg-gray-200 rounded-md p-4 border border-gray-300 overflow-x-auto'>
        <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-black rounded-full mr-2 flex items-center justify-center"><FaRobot color='#fff' /></div>
            <div className="font-bold">AI</div>
        </div>
        <ReactMarkdown>{message.content}</ReactMarkdown>
        {!!message?.toolInvocations?.length && message.content.length === 0 && <div className='flex items-center space-x-2'>
            <span className="italic font-light">Let me get back to you with the answer while I drink my coffee and read the docs...</span><PiCoffeeFill className='flex-shrink-0' color='#717171' />
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
import { Message } from 'ai';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { IoPerson } from 'react-icons/io5';


export const UserCard = ({ message }: { message: Message }) => {
    return <div className='bg-white rounded-md p-4 border border-gray-300'>
        <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 flex items-center justify-center"><IoPerson /></div>
            <div className="font-bold">User</div>
        </div>
        <ReactMarkdown className="font-actor">{message.content}</ReactMarkdown>
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
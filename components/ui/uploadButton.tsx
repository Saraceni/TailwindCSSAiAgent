import { useRef, useState } from 'react';
import { Button } from './button';
import { FaPaperclip } from 'react-icons/fa'; // Import an attach icon from react-icons

interface Props {
    onFilesChange: (files: FileList | undefined) => void;
    isSingleFile: boolean;
    hasFiles: boolean;
}

const UploadButton = ({ onFilesChange, hasFiles, isSingleFile = false }: Props) => {

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            onFilesChange(event.target.files);
        }
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the file input click
        }
    };


    const isFileAttached = hasFiles;

    let title = 'Attach Files'
    if(isSingleFile) title = 'Attach File'
    if(isFileAttached && !isSingleFile) title = 'Change Files'
    else if(isFileAttached && isSingleFile) title = 'Change File'

    return (
        <div>
            <Button
                type="button"
                onClick={handleButtonClick}
                className="flex items-center border rounded"
            >
                <FaPaperclip className="mr-2" /> {/* Attach icon */}
                {title}
            </Button>
            <input
                type="file"
                className="hidden" // Hide the file input
                onChange={handleFileChange}
                multiple
                ref={fileInputRef}
            />
        </div>
    );
};

export default UploadButton;
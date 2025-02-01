"use client"

import React, { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import * as Form from "@radix-ui/react-form"
import { X } from "lucide-react"
import { MdCloudUpload } from "react-icons/md";
import { FaRegFilePdf } from "react-icons/fa6";

interface FileUploadProps {
    onFileSelect: (file: File) => void
    acceptedFileTypes?: string[]
    maxFileSize?: number
}

export function FileUpload({
    onFileSelect,
    acceptedFileTypes = ["image/*", "application/pdf"],
    maxFileSize = 5 * 1024 * 1024, // 5MB
}: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const selectedFile = acceptedFiles[0]
            if (selectedFile) {
                if (selectedFile.size > maxFileSize) {
                    setError(`File size should be less than ${maxFileSize / (1024 * 1024)}MB`)
                } else if (!acceptedFileTypes.some((type) => selectedFile.type.match(type))) {
                    setError("Invalid file type")
                } else {
                    setFile(selectedFile)
                    onFileSelect(selectedFile)
                    setError(null)
                }
            }
        },
        [maxFileSize, acceptedFileTypes, onFileSelect],
    )

    //const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedFileTypes.reduce((acc, type) => {
          return { ...acc, [type]: [] }; // Create an object for accepted file types
        }, {}),
      });

    const removeFile = () => {
        setFile(null)
        setError(null)
    }

    return (
        <Form.Root className="w-full">
            <Form.Field name="file">
                <div className="flex flex-col items-center">
                    <div
                        {...getRootProps()}
                        className={`w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                            }`}
                    >
                        <input {...getInputProps()} accept={acceptedFileTypes.join(",")} />
                        <div className="flex flex-col items-center justify-center space-y-2">
                            {file ? (<FaRegFilePdf className="text-4xl text-gray-600 mr-2" />) : (<MdCloudUpload className="text-4xl text-gray-500 mr-2" />)}
                            {file ? (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{file.name}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeFile()
                                        }}
                                        className="p-1 text-gray-500 hover:text-gray-700"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-center text-gray-500">
                                    {isDragActive ? "Drop the file here" : "Drag 'n' drop a file here, or click to select a file"}
                                </p>
                            )}
                        </div>
                        {error && <Form.Message className="mt-2 text-sm text-red-600">{error}</Form.Message>}
                    </div>
                </div>
            </Form.Field>
            {file && file.type.startsWith("image/") && (
                <div className="mt-4">
                    <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt="File preview"
                        className="max-w-full h-auto rounded-lg"
                    />
                </div>
            )}
        </Form.Root>
    )
}


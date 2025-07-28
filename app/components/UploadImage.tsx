"use client";

import React, { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";

interface UploadExampleProps {
    setImageUrl: (url: string) => void;
}

const UploadExample: React.FC<UploadExampleProps> = ({ setImageUrl }) => {
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortController = new AbortController();

    const authenticator = async () => {
        try {
            const response = await fetch("/api/upload-auth");
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setProgress(0);
            setUploadSuccess(false);
        }
    };

    const triggerFileSelect = () => {
        if (!isUploading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setProgress(0);
        setIsUploading(false);
        setUploadSuccess(false);
        setImageUrl(''); // Clear the image URL in parent component
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file to upload");
            return;
        }

        setIsUploading(true);
        setProgress(0);

        try {
            const authParams = await authenticator();
            const { signature, expire, token, publicKey } = authParams;

            const uploadResponse = await upload({
                expire,
                token,
                signature,
                publicKey,
                file: selectedFile,
                fileName: selectedFile.name,
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                abortSignal: abortController.signal,
            });
            
            // console.log("Upload response:", uploadResponse);
            setUploadSuccess(true);
            
            // Update the parent component with the uploaded image URL
            if (uploadResponse.url) {
                setImageUrl(uploadResponse.url);
            }
        } catch (error) {
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                console.error("Upload error:", error);
            }
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <label className="flex items-center text-sm font-bold text-gray-800">
                <ImageIcon className="w-4 h-4 mr-2 text-gray-600" />
                Upload Image
            </label>
            
            {!selectedFile ? (
                <div className="relative group">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div 
                        onClick={triggerFileSelect}
                        className="flex items-center justify-between p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-100 transition-all duration-200 group-hover:scale-[1.02] cursor-pointer"
                    >
                        <div className="flex items-center space-x-3 pointer-events-none">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Upload className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Choose file</p>
                                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                            </div>
                        </div>
                        <span className="text-gray-500 text-sm pointer-events-none">No file chosen</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className={`flex items-center justify-between p-4 border-2 rounded-xl ${
                        uploadSuccess 
                            ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200'
                    }`}>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <ImageIcon className={`w-5 h-5 ${uploadSuccess ? 'text-green-600' : 'text-gray-600'}`} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{selectedFile.name}</p>
                                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={removeFile}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    {isUploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium text-gray-700">
                                <span>Upload progress</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-black to-gray-700 h-3 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                    
                    {!uploadSuccess && !isUploading && (
                        <button
                            type="button"
                            onClick={handleUpload}
                            className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <Upload className="w-4 h-4" />
                                <span>Upload Image</span>
                            </div>
                        </button>
                    )}
                    
                    {uploadSuccess && (
                        <div className="text-center py-2">
                            <p className="text-green-600 font-medium">✓ Upload successful!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UploadExample;
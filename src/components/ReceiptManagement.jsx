import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/config/firebase';
import { Image, X, Upload, Loader2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from './ui/alert-dialog';

const ReceiptManagement = ({ expenseId, receiptUrl, onReceiptUpdate }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [isViewingReceipt, setIsViewingReceipt] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please upload an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File size should be less than 5MB');
            return;
        }

        setIsUploading(true);
        setUploadError('');

        try {
            // Delete existing receipt if any
            if (receiptUrl) {
                const oldReceiptRef = ref(storage, receiptUrl);
                await deleteObject(oldReceiptRef);
            }

            // Upload new receipt
            const storageRef = ref(storage, `receipts/${expenseId}/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);

            onReceiptUpdate(downloadUrl);
        } catch (error) {
            console.error('Error uploading receipt:', error);
            setUploadError('Failed to upload receipt. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!receiptUrl) return;

        try {
            const receiptRef = ref(storage, receiptUrl);
            await deleteObject(receiptRef);
            onReceiptUpdate(null);
        } catch (error) {
            console.error('Error deleting receipt:', error);
            setUploadError('Failed to delete receipt. Please try again.');
        }
    };

    return (
        <div>
            {/* Upload/View Controls */}
            <div className="flex gap-2 items-center">
                {receiptUrl ? (
                    <>
                        <button
                            onClick={() => setIsViewingReceipt(true)}
                            className="flex items-center gap-1 text-primary hover:text-primary/80"
                        >
                            <Image size={16} />
                            View Receipt
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-1 text-destructive hover:text-destructive/80"
                        >
                            <X size={16} />
                            Remove
                        </button>
                    </>
                ) : (
                    <label className="flex items-center gap-2 cursor-pointer text-primary hover:text-primary/80">
                        {isUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Upload size={16} />
                        )}
                        Upload Receipt
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                    </label>
                )}
            </div>

            {/* Error Message */}
            {uploadError && (
                <p className="text-sm text-destructive mt-1">{uploadError}</p>
            )}

            {/* Receipt Viewer Dialog */}
            <AlertDialog open={isViewingReceipt} onOpenChange={setIsViewingReceipt}>
                <AlertDialogContent className="max-w-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Receipt</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="mt-4">
                                <img
                                    src={receiptUrl}
                                    alt="Receipt"
                                    className="max-h-[70vh] mx-auto"
                                />
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setIsViewingReceipt(false)}>
                            Close
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ReceiptManagement;
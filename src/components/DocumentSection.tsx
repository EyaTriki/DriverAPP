import React from 'react';
import DocumentUploadSection from './DocumentUploadSection';
import DocumentPreviewSection from './DocumentPreviewSection';

interface DocumentData {
    uploaded: boolean;
    fileName: string;
    fileSize: string;
    uri: string | null;
}

interface DocumentSectionProps {
    title: string;
    document: DocumentData;
    onUpload: () => void;
    onUpdate: () => void;
    supportedFormats?: string[];
}

const DocumentSection: React.FC<DocumentSectionProps> = ({
    title,
    document,
    onUpload,
    onUpdate,
    supportedFormats = ['PNG', 'JPG', 'PDF'],
}) => {
    if (document.uploaded) {
        return (
            <DocumentPreviewSection
                title={title}
                fileName={document.fileName}
                fileSize={document.fileSize}
                onUpdate={onUpdate}
            />
        );
    }

    return (
        <DocumentUploadSection
            title={title}
            onPress={onUpload}
            supportedFormats={supportedFormats}
        />
    );
};

export default DocumentSection;

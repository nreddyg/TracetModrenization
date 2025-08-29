import React, { forwardRef, useState, useRef, useCallback } from 'react';
import { Button } from './button';
import { Label } from './label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Progress } from './progress';
import { cn } from '@/lib/utils';
import { 
  Upload, 
  X, 
  File, 
  Image, 
  FileText, 
  Video, 
  Music, 
  Eye, 
  Download, 
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

export type UploadStatus = 'uploading' | 'done' | 'error' | 'removed';

export interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
  status?: UploadStatus;
  percent?: number;
  response?: any;
  error?: any;
  thumbUrl?: string;
}

export interface UploadProps {
  label?: string;
  tooltip?: string;
  error?: string;
  isRequired?:boolean;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  value?: UploadFile[];
  disabled?: boolean;
  showPreview?: boolean; // Shows preview thumbnails for images
  showUploadList?: boolean; // Shows the list of uploaded files
  showPreviewIcon?: boolean; // Shows preview icon in file actions
  showDownloadIcon?: boolean; // Shows download icon in file actions
  showRemoveIcon?: boolean; // Shows remove icon in file actions
  dragAndDrop?: boolean;
  directory?: boolean;
  listType?: 'text' | 'picture' | 'picture-card';
  action?: string; // upload URL
  method?: string;
  headers?: Record<string, string>;
  data?: Record<string, string | Blob | number | boolean> | ((file: File) => Record<string, string | Blob | number | boolean>);
  withCredentials?: boolean;
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<boolean>;
  customRequest?: (options: {
    file: File;
    onProgress: (event: { percent: number }) => void;
    onSuccess: (response: any) => void;
    onError: (error: any) => void;
  }) => void;

  previewFile?: (file: File) => Promise<string>;
  isImageUrl?: (file: UploadFile) => boolean;
  itemRender?: (originNode: React.ReactElement, file: UploadFile, fileList: UploadFile[]) => React.ReactElement;
  containerClassName?: string;
  className?: string;
  onChange?: (files: UploadFile[]) => void;
  onFileRemove?: (file: UploadFile) => void;
  onPreview?: (file: UploadFile) => void;
  onDownload?: (file: UploadFile) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export const ReusableUpload = forwardRef<HTMLInputElement, UploadProps>(
  ({ 
    label, 
    tooltip, 
    error, 
    multiple = true,
    accept = "*/*",
    maxSize = 10,
    maxFiles = 5,
    value = [],
    disabled = false,
    showPreview = true,
    showUploadList = true,
    showPreviewIcon = true,
    showDownloadIcon = true,
    showRemoveIcon = true,
    dragAndDrop = true,
    directory = false,
    listType = 'text',
    isRequired=false,
    action,
    method = 'POST',
    headers,
    data,
    withCredentials = false,
    beforeUpload,
    customRequest,
    previewFile,
    isImageUrl,
    itemRender,
    containerClassName,
    className,
    onChange,
    onFileRemove,
    onPreview,
    onDownload,
    onDrop,
    ...props 
  }, ref) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
    const inputRef = useRef<HTMLInputElement>(null);

    const renderLabel = () => {
      if (!label) return null;

      const labelElement = <Label className="text-sm font-medium">{label}{isRequired ?<span className='text-red-500'> *</span>:''}</Label>;

      if (tooltip) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {labelElement}
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return labelElement;
    };

    const generatePreview = useCallback(async (file: File, fileId: string) => {
      if (previewFile) {
        try {
          const preview = await previewFile(file);
          setPreviewUrls(prev => ({ ...prev, [fileId]: preview }));
        } catch (error) {
          console.error('Failed to generate preview:', error);
        }
      } else if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrls(prev => ({ ...prev, [fileId]: url }));
      }
    }, [previewFile]);

    const performUpload = async (file: File, fileItem: UploadFile) => {
      if (customRequest) {
        customRequest({
          file,
          onProgress: (event) => {
            updateFileStatus(fileItem.id, { percent: event.percent });
          },
          onSuccess: (response) => {
            updateFileStatus(fileItem.id, { 
              status: 'done', 
              percent: 100, 
              response 
            });
          },
          onError: (error) => {
            updateFileStatus(fileItem.id, { 
              status: 'error', 
              error 
            });
          }
        });
      } else if (action) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          if (data) {
            const extraData = typeof data === 'function' ? data(file) : data;
            Object.entries(extraData).forEach(([key, value]) => {
              if (value instanceof Blob) {
                formData.append(key, value);
              } else if (typeof value === 'string') {
                formData.append(key, value);
              } else if (value !== null && value !== undefined) {
                formData.append(key, String(value));
              }
            });
          }

          const response = await fetch(action, {
            method,
            body: formData,
            headers,
            credentials: withCredentials ? 'include' : 'same-origin'
          });

          if (response.ok) {
            const result = await response.json();
            updateFileStatus(fileItem.id, { 
              status: 'done', 
              percent: 100, 
              response: result 
            });
          } else {
            throw new Error(`Upload failed: ${response.statusText}`);
          }
        } catch (error) {
          updateFileStatus(fileItem.id, { 
            status: 'error', 
            error 
          });
        }
      } else {
        // No upload action, just mark as done
        updateFileStatus(fileItem.id, { status: 'done', percent: 100 });
      }
    };

    const validateFileType = (file: File, acceptPattern: string): boolean => {
      if (acceptPattern === "*/*") return true;
      
      const acceptTypes = acceptPattern.split(',').map(type => type.trim());
      
      for (const acceptType of acceptTypes) {
        // Handle specific extensions like .pdf, .doc, etc.
        if (acceptType.startsWith('.')) {
          const extension = acceptType.toLowerCase();
          const fileName = file.name.toLowerCase();
          if (fileName.endsWith(extension)) {
            return true;
          }
        }
        // Handle MIME types like image/*, application/pdf, etc.
        else if (acceptType.includes('/')) {
          if (acceptType.endsWith('/*')) {
            // Handle wildcard types like image/*
            const baseType = acceptType.replace('/*', '');
            if (file.type.startsWith(baseType + '/')) {
              return true;
            }
          } else {
            // Handle specific MIME types
            if (file.type === acceptType) {
              return true;
            }
          }
        }
      }
      
      return false;
    };

    const updateFileStatus = (fileId: string, updates: Partial<UploadFile>) => {
      if (onChange) {
        const updatedFiles = value.map(file => 
          file.id === fileId ? { ...file, ...updates } : file
        );
        onChange(updatedFiles);
      }
    };

    // const handleFileSelect = async (files: FileList | null) => {
    //   if (!files || !onChange) return;

    //   const fileArray = Array.from(files);
    //   const currentCount = value.length;

    //   for (let i = 0; i < fileArray.length; i++) {
    //     if (!multiple && i > 0) break;
    //     if (currentCount + i >= maxFiles) break;

    //     const file = fileArray[i];
        
    //     // Validate file type
    //     if (!validateFileType(file, accept)) {
    //       continue;
    //     }
        
    //     // Check file size
    //     if (file.size > maxSize * 1024 * 1024) {
    //       continue;
    //     }

    //     // Run beforeUpload check
    //     if (beforeUpload) {
    //       try {
    //         const shouldUpload = await beforeUpload(file, fileArray);
    //         if (!shouldUpload) continue;
    //       } catch (error) {
    //         continue;
    //       }
    //     }

    //     const processedFile = file;

    //     const uploadFileItem: UploadFile = {
    //       id: Date.now().toString() + i,
    //       name: file.name,
    //       size: file.size,
    //       type: file.type,
    //       file: processedFile,
    //       url: URL.createObjectURL(processedFile),
    //       status: action || customRequest ? 'uploading' : 'done',
    //       percent: action || customRequest ? 0 : 100
    //     };

    //     // Generate preview
    //     if (showPreview) {
    //       generatePreview(processedFile, uploadFileItem.id);
    //     }

    //     // Add to file list
    //     const newFiles = multiple ? [...value, uploadFileItem] : [uploadFileItem];
    //     onChange(newFiles);

    //     // Start upload if needed
    //     if (action || customRequest) {
    //       performUpload(processedFile, uploadFileItem);
    //     }
    //   }
    // };

    
    
    const handleFileSelect = async (files: FileList | null) => {
  if (!files || !onChange) return;

  const fileArray = Array.from(files);
  const currentCount = value.length;
  const newFiles: UploadFile[] = []; // Collect all new files first

  for (let i = 0; i < fileArray.length; i++) {
    if (!multiple && i > 0) break;
    if (currentCount + newFiles.length >= maxFiles) break;

    const file = fileArray[i];
    
    // Validate file type
    if (!validateFileType(file, accept)) {
      console.warn(`File ${file.name} has invalid type`);
      continue;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      console.warn(`File ${file.name} is too large`);
      continue;
    }

    // Run beforeUpload check
    if (beforeUpload) {
      try {
        const shouldUpload = await beforeUpload(file, fileArray);
        if (!shouldUpload) continue;
      } catch (error) {
        console.warn(`beforeUpload failed for ${file.name}`);
        continue;
      }
    }

    const processedFile = file;

    const uploadFileItem: UploadFile = {
      id: Date.now().toString() + i + Math.random().toString(36).substr(2, 9), // More unique ID
      name: file.name,
      size: file.size,
      type: file.type,
      file: processedFile,
      url: URL.createObjectURL(processedFile),
      status: action || customRequest ? 'uploading' : 'done',
      percent: action || customRequest ? 0 : 100
    };

    // Generate preview
    if (showPreview) {
      generatePreview(processedFile, uploadFileItem.id);
    }

    newFiles.push(uploadFileItem);
  }

  // Update the file list with all new files at once
  if (newFiles.length > 0) {
    const updatedFiles = multiple ? [...value, ...newFiles] : newFiles;
    onChange(updatedFiles);

    // Start uploads for all new files if needed
    if (action || customRequest) {
      newFiles.forEach(uploadFileItem => {
        if (uploadFileItem.file) {
          performUpload(uploadFileItem.file, uploadFileItem);
        }
      });
    }
  }
};
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (!disabled) {
        onDrop?.(e);
        handleFileSelect(e.dataTransfer.files);
      }
    };

    const handleRemoveFile = (file: UploadFile) => {
      if (onFileRemove) onFileRemove(file);
      if (onChange) {
        onChange(value.filter(f => f.id !== file.id));
      }
      // Clean up preview URL
      if (previewUrls[file.id]) {
        URL.revokeObjectURL(previewUrls[file.id]);
        setPreviewUrls(prev => {
          const newUrls = { ...prev };
          delete newUrls[file.id];
          return newUrls;
        });
      }
    };

    const handleRetry = (file: UploadFile) => {
      if (file.file) {
        updateFileStatus(file.id, { status: 'uploading', percent: 0, error: null });
        performUpload(file.file, file);
      }
    };

    const handlePreview = (file: UploadFile) => {
      if (onPreview) {
        onPreview(file);
      } else if (file.url) {
        window.open(file.url, '_blank');
      }
    };

    const handleDownload = (file: UploadFile) => {
      if (onDownload) {
        onDownload(file);
      } else if (file.url) {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    const getFileIcon = (type: string) => {
      if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
      if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
      if (type.startsWith('audio/')) return <Music className="h-4 w-4" />;
      if (type.includes('text') || type.includes('document')) return <FileText className="h-4 w-4" />;
      return <File className="h-4 w-4" />;
    };

    const getStatusIcon = (status?: UploadStatus) => {
      switch (status) {
        case 'done':
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'error':
          return <XCircle className="h-4 w-4 text-red-500" />;
        case 'uploading':
          return <Clock className="h-4 w-4 text-blue-500" />;
        default:
          return null;
      }
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const checkIsImageUrl = (file: UploadFile) => {
      if (isImageUrl) return isImageUrl(file);
      return file.type.startsWith('image/');
    };

    const renderFileItem = (file: UploadFile) => {
      const isImage = checkIsImageUrl(file);
      const previewUrl = previewUrls[file.id] || file.thumbUrl || file.url;

      if (listType === 'picture-card') {
        return (
          <div key={file.id} className="relative w-24 h-24 border rounded-lg overflow-hidden group bg-gray-50">
            {isImage && previewUrl && showPreview ? (
              <img 
                src={previewUrl} 
                alt={file.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                {getFileIcon(file.type)}
              </div>
            )}
            
            {file.status === 'uploading' && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-xs">{file.percent || 0}%</div>
              </div>
            )}

            {file.status === 'error' && (
              <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
            )}

            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-1">
                {showPreviewIcon && isImage && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:text-white h-6 w-6 p-0"
                    onClick={() => handlePreview(file)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                )}
                {showDownloadIcon && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:text-white h-6 w-6 p-0"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                )}
                {showRemoveIcon && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:text-white h-6 w-6 p-0"
                    onClick={() => handleRemoveFile(file)}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {file.status === 'error' && (
              <div className="absolute top-1 right-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 h-4 w-4 p-0"
                  onClick={() => handleRetry(file)}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        );
      }

      const isPicture = listType === 'picture';
      
      // Text list type - simple list without card styling
      if (listType === 'text') {
        const defaultNode = (
          <div key={file.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm truncate">{file.name}</span>
                  {getStatusIcon(file.status)}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{formatFileSize(file.size)}</span>
                  {file.status === 'uploading' && file.percent !== undefined && (
                    <span>{file.percent}%</span>
                  )}
                </div>
                
                {file.status === 'uploading' && file.percent !== undefined && (
                  <Progress value={file.percent} className="mt-1 h-1" />
                )}
                
                {file.status === 'error' && file.error && (
                  <p className="text-xs text-red-500 mt-1">{file.error.toString()}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {showPreviewIcon && isImage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePreview(file)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              
              {showDownloadIcon && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(file)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}

              {file.status === 'error' && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRetry(file)}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}

              {showRemoveIcon && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(file)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );

        return itemRender ? itemRender(defaultNode, file, value) : defaultNode;
      }

      // Picture list type - card with image preview
      const defaultNode = (
        <div key={file.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
          {isPicture && isImage && previewUrl && showPreview ? (
            <img 
              src={previewUrl} 
              alt={file.name} 
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
              {getFileIcon(file.type)}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{file.name}</p>
              {getStatusIcon(file.status)}
            </div>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            
            {file.status === 'uploading' && file.percent !== undefined && (
              <Progress value={file.percent} className="mt-1 h-1" />
            )}
            
            {file.status === 'error' && file.error && (
              <p className="text-xs text-red-500 mt-1">{file.error.toString()}</p>
            )}
          </div>

          <div className="flex items-center gap-1">
            {showPreviewIcon && isImage && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handlePreview(file)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            
            {showDownloadIcon && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(file)}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}

            {file.status === 'error' && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRetry(file)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}

            {showRemoveIcon && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFile(file)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      );

      return itemRender ? itemRender(defaultNode, file, value) : defaultNode;
    };

    const renderUploadArea = () => {
      if (listType === 'picture-card') {
        return (
          <div
            className={cn(
              "w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors",
              isDragOver && !disabled ? "border-primary bg-primary/5" : "border-gray-300",
              disabled && "opacity-50 cursor-not-allowed",
              error && "border-red-500"
            )}
            onClick={() => !disabled && inputRef.current?.click()}
            onDragOver={dragAndDrop ? handleDragOver : undefined}
            onDragLeave={dragAndDrop ? handleDragLeave : undefined}
            onDrop={dragAndDrop ? handleDrop : undefined}
          >
            <Upload className="h-6 w-6 text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Upload</span>
          </div>
        );
      }

      if (!dragAndDrop) {
        // Button-style upload similar to Ant Design
        return (
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {multiple ? 'Select Files' : 'Select File'}
            </Button>
            <p className="text-xs text-gray-500">
              Max {maxSize}MB per file{multiple ? `, up to ${maxFiles} files` : ''}
            </p>
          </div>
        );
      }

      return (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg transition-colors",
            isDragOver && !disabled ? "border-primary bg-primary/5" : "border-gray-300",
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-red-500",
            className
          )}
          onDragOver={dragAndDrop ? handleDragOver : undefined}
          onDragLeave={dragAndDrop ? handleDragLeave : undefined}
          onDrop={dragAndDrop ? handleDrop : undefined}
        >
          <div className="p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-sm text-gray-600 mb-2">
              Drag and drop files here, or{' '}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                browse
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Max {maxSize}MB per file, up to {maxFiles} files
            </p>
          </div>
        </div>
      );
    };

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {renderLabel()}
        
        <input
          ref={ref || inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          {...(directory ? { webkitdirectory: '', directory: '' } as any : {})}
          className="sr-only"
          {...props}
        />

        {listType === 'picture-card' ? (
          <div className="flex flex-wrap gap-2">
            {showUploadList && value.map(renderFileItem)}
            {(!maxFiles || value.length < maxFiles) && renderUploadArea()}
          </div>
        ) : (
          <>
            {renderUploadArea()}
            {showUploadList && value.length > 0 && (
              <div className={cn(
                listType === 'text' ? "border rounded-lg p-2" : "space-y-2"
              )}>
                {value.map(renderFileItem)}
              </div>
            )}
          </>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

ReusableUpload.displayName = "ReusableUpload";
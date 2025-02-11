import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';

export type CDNImage = {
  public_id: string;
  secure_url: string;
};

type UploadMultipleFilesProps = {
  formData: FormData;
  onUploadProgress: (progress: number) => void;
};

export const uploadMultipleFiles = async ({
  formData,
  onUploadProgress,
}: UploadMultipleFilesProps): Promise<CDNImage> => {
  const { data } = await axios.request<CDNImage>({
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: process.env.NEXT_PUBLIC_CLOUDINARY_URL || '',
    data: formData,
    onUploadProgress(progressEvent) {
      const completedPercent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total!,
      );
      onUploadProgress(completedPercent);
    },
  });

  return { ...data };
};

export const useUploadMultipleFiles = (
  formats: string[] = ['.png', '.jpg', '.jpeg'],
  maxFiles: number = 6,
  maxSize: number = 5120000,
  batchSize: number = 3, // Upload batch size
) => {
  const [queue, setQueue] = useState<FormData[]>([]);
  const [images, setImages] = useState<CDNImage[]>([]);
  const [progressStatus, setProgressStatus] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newQueue = acceptedFiles.map((file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
      );
      return formData;
    });

    setQueue((prevQueue) => [...prevQueue, ...newQueue]);
  }, []);

  const { getRootProps, getInputProps, fileRejections, isDragActive } =
    useDropzone({
      maxFiles,
      maxSize,
      accept: {
        'image/*': formats,
      },
      onDrop,
    });

  const uploadImages = async () => {
    setIsUploading(true);
    for (let i = 0; i < queue.length; i += batchSize) {
      const batch = queue.slice(i, i + batchSize);

      await Promise.all(
        batch.map((formData, index) => {
          const batchIndex = i + index;
          return uploadMultipleFiles({
            formData,
            onUploadProgress: (progress) => {
              setProgressStatus((prev) => {
                const newStatus = [...prev];
                newStatus[batchIndex] = progress;
                return newStatus;
              });
            },
          })
            .then((image) => {
              setImages((prev) => [...prev, image]);
            })
            .catch((err) => {
              if (axios.isAxiosError<{ message: string }>(err)) {
                toast.error(err.response?.data.message || 'Upload failed');
              }
            });
        }),
      );
    }

    setQueue([]);
    setProgressStatus([]);
    setIsUploading(false);
  };

  useEffect(() => {
    if (queue.length > 0 && !isUploading) {
      uploadImages();
    }
  }, [queue]);

  return {
    isUploading,
    isDragActive,
    images,
    progressStatus,
    inputRef,
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target?.files;
      if (!files) return;

      const newQueue = Array.from(files).map((file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append(
          'upload_preset',
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
        );
        return formData;
      });

      setQueue((prevQueue) => [...prevQueue, ...newQueue]);
    },
    getRootProps,
    getInputProps,
  };
};

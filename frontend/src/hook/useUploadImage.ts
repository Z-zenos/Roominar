import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { DropzoneOptions } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { Message } from 'react-hook-form';

export const DROPZONE_OPTIONS: DropzoneOptions = {
  accept: {
    'image/*': ['.png', '.jpg', '.jpeg'],
  },
  noClick: true,
  maxFiles: 1,
  maxSize: 5120000,
};

export type CDNImage = {
  public_id: string;
  secure_url: string;
};

type UploadFileProps = {
  formData: FormData | null;
  onUploadProgress: (progress: number) => void;
};

export const uploadFile = async ({
  formData,
  onUploadProgress,
}: UploadFileProps): Promise<CDNImage> => {
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

export const useUpload = (
  formats: string[] = ['.png', '.jpg', '.jpeg'],
  maxFiles: number = 1,
  maxSize: number = 5120000,
) => {
  const [formatImage, setFormatImage] = useState<FormData | null>(null);
  const [image, setImage] = useState<CDNImage | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progressStatus, setProgressStatus] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    const formData = new FormData();

    formData.append('file', acceptedFiles[0]);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
    );

    setFormatImage(formData);
  }, []);

  const { getRootProps, getInputProps, fileRejections, isDragActive } =
    useDropzone({
      ...DROPZONE_OPTIONS,
      maxFiles: maxFiles,
      maxSize: maxSize,
      accept: {
        'image/*': formats,
      },
      onDrop,
    });

  const onFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target?.files;

    const formData = new FormData();
    const file = files?.[0];

    if (!formats.includes(file?.type)) return;

    formData.append('file', file);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
    );

    setFormatImage(formData);
  };

  useEffect(() => {
    if (fileRejections.length) {
      fileRejections
        .map((el) => el.errors)
        .map((err) => {
          err.map((el) => {
            if (el.code.includes('file-invalid-type')) {
              toast.error(
                `File type must be ${formats?.map((f) => `.${f}`).join(', ')}`,
              );

              return;
            }
            if (el.code.includes('file-too-large')) {
              toast.error(`File is larger than ${maxSize}MB`);

              return;
            }
          });
        });
    }
  }, [fileRejections, formats, maxSize]);

  useEffect(() => {
    (async () => {
      if (!formatImage) return;

      try {
        setIsFetching(true);
        const data = await uploadFile({
          formData: formatImage,
          onUploadProgress(progress) {
            setProgressStatus(progress);
          },
        });

        if (data) {
          setFormatImage(null);
          setImage(data);
          setIsFetching(false);
          setIsSuccess(true);
          toast.success('Successfully uploaded!');
        }
      } catch (err) {
        if (axios.isAxiosError<{ message: string }>(err)) {
          toast.error(err.response?.data.message as Message);
        }
        if (err instanceof Error) {
          toast.error(err.message);
        }
        setFormatImage(null);
        setImage(null);
        setIsFetching(false);
        setIsSuccess(false);
      }
    })();
  }, [formatImage]);

  return {
    isFetching,
    isDragActive,
    isSuccess,
    image,
    progressStatus,
    inputRef,
    onFileChange,
    getRootProps,
    getInputProps,
  };
};

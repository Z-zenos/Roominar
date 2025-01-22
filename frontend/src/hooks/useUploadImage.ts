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
import crypto from 'crypto';

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

  const deleteImage = useCallback(async (publicId: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_PUBLIC_KEY;
      const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET_KEY;

      const timestamp = Math.floor(Date.now() / 1000);
      const signature = crypto
        .createHash('sha1')
        .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
        .digest('hex');

      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', apiKey);
      formData.append('signature', signature);

      await axios.post(`${process.env.NEXT_PUBLIC_CLOUDINARY_DELETE_URL}`, {
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData,
      });
      setImage(null);
      toast.success('Image deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete image. Please try again.');
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      if (image) {
        // Delete the existing image before uploading a new one
        deleteImage(image.public_id);
      }

      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
      );
      setFormatImage(formData);
    },
    [image, deleteImage],
  );

  const { getRootProps, getInputProps, fileRejections, isDragActive } =
    useDropzone({
      ...DROPZONE_OPTIONS,
      maxFiles,
      maxSize,
      accept: { 'image/*': formats },
      onDrop,
    });

  const onFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target?.files;
    console.log('image: ', image);
    if (image) {
      // Delete the existing image before uploading a new one
      deleteImage(image.public_id);
    }

    const formData = new FormData();
    const file = files?.[0];
    if (!formats.map((f) => `image/${f.slice(1)}`).includes(file?.type)) return;
    formData.append('file', file);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
    );
    setFormatImage(formData);
  };

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
    deleteImage,
  };
};

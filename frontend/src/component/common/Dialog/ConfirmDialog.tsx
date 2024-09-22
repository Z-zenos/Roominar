import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import type { ReactNode } from 'react';

interface ConfirmDialogProps {
  title?: string;
  content?: ReactNode | string;
  isOpen: boolean;
  onOpen?(): void;
  onOpenChange(): void;
  onConfirm(): void;
  confirmLabel?: string;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  title = 'Confirm',
  content,
  isOpen,
  onOpenChange,
  onConfirm,
  confirmLabel,
  isLoading,
}: ConfirmDialogProps) {
  return (
    <>
      <Modal
        backdrop='opaque'
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: 'easeOut',
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: 'easeIn',
              },
            },
          },
        }}
        className='top-[-10%]'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>{title}</ModalHeader>
              <ModalBody>
                <div>{content}</div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  variant='light'
                  onPress={onClose}
                  radius='sm'
                >
                  Close
                </Button>
                <Button
                  color='primary'
                  onPress={onConfirm}
                  isLoading={isLoading}
                  radius='sm'
                >
                  {confirmLabel}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

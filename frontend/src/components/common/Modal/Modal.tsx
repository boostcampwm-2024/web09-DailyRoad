import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  isOpen: boolean;
  isBackdropClosable?: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  className?: string;
};

const Modal = ({
  closeModal,
  isOpen = false,
  isBackdropClosable = true,
  children,
  className = '',
}: ModalProps) => {
  const handleEscKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isBackdropClosable) {
        closeModal();
      }
    },
    [closeModal, isBackdropClosable],
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscKeyPress);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEscKeyPress);
    };
  }, [isOpen, handleEscKeyPress]);

  return createPortal(
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[200] bg-gray-800 bg-opacity-50 backdrop-blur-sm"
            onClick={isBackdropClosable ? closeModal : undefined}
          />
          <div
            className={`fixed left-1/2 top-1/2 z-[200] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg ${className}`}
          >
            <button
              type="button"
              aria-label="모달 닫기 버튼"
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {children}
          </div>
        </>
      )}
    </>,
    document.body,
  );
};

export default Modal;

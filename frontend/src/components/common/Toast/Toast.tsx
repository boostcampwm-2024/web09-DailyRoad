import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { ToastType } from '@/store/toastSlice';

type ToastProps = {
  duration?: number;
} & ToastType;

const TOAST_STYLE = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-black',
  info: 'bg-blue-500 text-white',
  default: 'bg-gray-500 text-white',
};

const Toast = ({
  id,
  message,
  duration = 1000 * 3,
  attributes,
  variant,
}: ToastProps) => {
  const removeToast = useStore((state) => state.removeToast);

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration - 500);

    const removeTimer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [id, duration, removeToast]);

  return (
    <div
      className={
        attributes +
        TOAST_STYLE[variant] +
        ` z-10 flex h-[40px] w-96 items-center justify-center rounded-md shadow-md` +
        (isVisible ? ' animate-slideInUp' : ' animate-fadeOut')
      }
    >
      {message}
    </div>
  );
};

export default Toast;

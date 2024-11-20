import { Component, ComponentType, PropsWithChildren } from 'react';
import { ErrorProps } from './ErrorFallback';

type ErrorBoundaryProps = {
  Fallback: ComponentType<ErrorProps>;
  onReset?: (error: Error) => void;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

const initialState: State = {
  hasError: false,
  error: null,
};

class ErrorBoundary extends Component<
  PropsWithChildren<ErrorBoundaryProps>,
  State
> {
  state: State = initialState;

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    const { onReset } = this.props;
    const { error } = this.state;

    onReset?.(error!);
    this.setState(initialState);
  };

  render() {
    const { Fallback, children } = this.props;
    const { hasError, error } = this.state;

    if (hasError && error) {
      return <Fallback />;
    }

    return children;
  }
}

export default ErrorBoundary;

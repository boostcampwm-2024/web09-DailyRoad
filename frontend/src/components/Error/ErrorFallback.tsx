export type ErrorProps = {
  statusCode?: number;
  errorCode?: number;
  resetError?: () => void;
};

const ErrorFallback = ({ statusCode, errorCode, resetError }: ErrorProps) => {
  return (
    <div role="alert" style={{ padding: '20px', textAlign: 'center' }}>
      <h2>문제가 발생했습니다.</h2>
      {statusCode && <p>상태 코드: {statusCode}</p>}
      {errorCode && <p>에러 코드: {errorCode}</p>}
      <button onClick={() => (window.location.href = '/')}>
        메인으로 이동하기
      </button>
    </div>
  );
};

export default ErrorFallback;

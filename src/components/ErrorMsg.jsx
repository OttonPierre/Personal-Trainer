export default function ErrorMsg({ message, onRetry }) {
  return (
    <div>
      <p>{message || 'Algo deu errado.'}</p>
      {onRetry && <button type="button" onClick={onRetry}>Tentar de novo</button>}
    </div>
  );
}

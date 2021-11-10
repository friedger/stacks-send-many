export default function LoadingSpinner({text}) {

  return (
    <span
      className="d-flex align-items-center">
      <span
        role="status"
        className="spinner-border spinner-border-sm text-info align-text-top ms-1 me-2"
      />
      {text ? <span>{text}</span> : null}
    </span>
  );
}

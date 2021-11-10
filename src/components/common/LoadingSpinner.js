export default function LoadingSpinner(props) {

  //props.text

  return (
    <div
      style={{display: 'flex', alignItems: 'center'}}>
      <span
        role="status"
        className="spinner-border spinner-border-sm text-info align-text-top ms-1 me-2"
      />
      <span>
        {props.text}
      </span>
    </div>
  );
}

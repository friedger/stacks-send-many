export default function HeaderLogo(props) {
  const path = props.path || '/citycoin-icon-blue-reversed-75x75.png';
  const size = props.size || '75';
  const alt = props.alt || 'Citycoin CC Logo';
  return (
    <a href="/" className="text-dark text-decoration-none">
      <img src={path} width={size} alt={alt} />
    </a>
  );
}

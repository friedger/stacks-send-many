export default function HeaderTitle(props) {
  const title = props.title || 'CityCoins';
  return <span className="h1">{title}</span>;
}

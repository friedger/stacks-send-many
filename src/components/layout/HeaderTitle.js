export default function HeaderTitle({ title }) {
  const newTitle = title || 'CityCoins';
  return <span className="h1">{newTitle}</span>;
}

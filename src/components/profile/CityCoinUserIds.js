export default function CityCoinUserIds({ userId, city, version }) {
  return (
    <div className="row align-items-center">
      <div className="col-4 text-right text-nowrap">{userId}</div>
      <div className="col-4 text-center">
        {city.toUpperCase()} ({version})
      </div>
      <div className="w-100"></div>
    </div>
  );
}

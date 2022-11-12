async function get_data() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = await fetch(
    "http://worldtimeapi.org/api/timezone/America/Chicago"
  );
  return res.json();
}

export default async function Home() {
  const data = await get_data();
  return (
    <div className="bg-slate-500">
      <span>The data is: {JSON.stringify(data)}</span>
      Hello World
    </div>
  );
}

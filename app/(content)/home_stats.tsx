import {
  WalletIcon,
  BanknotesIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";

function format_money(money: number) {
  return "$" + money.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function HomeStats({
  total_value,
  assets,
  inv_cdf,
}: {
  total_value: number;
  assets: number;
  inv_cdf: number;
}) {
  const stats = [
    {
      id: 1,
      name: "Portfolio Value",
      stat: format_money(total_value),
      icon: WalletIcon,
    },
    {
      id: 2,
      name: "Liquid Assets",
      stat: format_money(parseFloat(assets.toString())),
      icon: BanknotesIcon,
    },
    {
      id: 3,
      name: "Chance to reach desired return",
      stat: (inv_cdf * 100).toFixed(2) + "%",
      icon: PresentationChartLineIcon,
    },
  ];
  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {item.stat}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

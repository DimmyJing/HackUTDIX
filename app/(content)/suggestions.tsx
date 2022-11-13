import {
  NewspaperIcon,
  UserPlusIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";

const stats = [
  {
    id: 1,
    ticker: "Stock",
    stat: "15% Likelihood",
    icon: NewspaperIcon,
  },
  {
    id: 2,
    ticker: "Mutual",
    stat: "15% Likelihood",
    icon: NewspaperIcon,
  },
  {
    id: 3,
    ticker: "MSFT",
    stat: "15% Likelihood",
    icon: NewspaperIcon,
  },
];

export default function Suggestions({
  recommendations,
}: {
  recommendations: { ticker: string; mean: number; std: number }[];
}) {
  return (
    <div className="w-full">
      <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((item) => (
          <div
            key={item.ticker}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <NewspaperIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {"Variance: " + item.std.toFixed(4)}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {item.ticker + ": $" + item.mean.toFixed(2)}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

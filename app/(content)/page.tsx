import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import HomeStats from "./home_stats";
import PortfolioEntries from "./portfolio_entries";
import MoneyDensity from "./money_density";
import Suggestions from "./suggestions";
import { calculate, get_mode_val, get_new_mean } from "./calculation";
import { HOST } from "app/remote";

function erf(x) {
  // constants
  var a1 = 0.254829592;
  var a2 = -0.284496736;
  var a3 = 1.421413741;
  var a4 = -1.453152027;
  var a5 = 1.061405429;
  var p = 0.3275911;

  // Save the sign of x
  var sign = 1;
  if (x < 0) {
    sign = -1;
  }
  x = Math.abs(x);

  // A&S formula 7.1.26
  var t = 1.0 / (1.0 + p * x);
  var y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

export default async function Home() {
  const email = cookies().get("email");
  if (email === undefined || email.value === "") redirect("/login");
  let investments = [];
  const positions = await fetch(HOST + "get_tickers/" + email.value).then(
    (data) => data.json()
  );
  const user_info: { exp_return: number; assets: number } = await fetch(
    HOST + "get_user_data/" + email.value
  ).then((data) => data.json());
  for (let i in positions) {
    const data: { price: number; std: number } = await fetch(
      HOST + "get_info/" + i
    ).then((data) => data.json());
    investments.push({
      ticker: i,
      type: positions[i].type,
      amount: positions[i].amount,
      confidence: positions[i].confidence,
      mean: data.price * positions[i].amount,
      std: data.std,
    });
  }
  const recommended_stocks = await fetch(
    HOST + "get_recommended/" + email.value
  ).then((data) => data.json());
  const special_total_mean = investments.reduce(
    (a, b) => a + b.mean * (b.confidence / 100 + 1),
    0
  );
  const total_mean = investments.reduce((a, b) => a + b.mean, 0);
  const total_max =
    Math.max(
      investments.reduce((a, b) => Math.max(a + b.mean), -Infinity),
      special_total_mean
    ) * 2;
  const total_var = investments.reduce(
    (a, b) => a + (b.mean / special_total_mean) * b.std,
    0
  );
  const actual_mean = get_new_mean(special_total_mean, total_var);
  const expected_x = total_mean * (user_info.exp_return / 100 + 1);
  const erf_input =
    (Math.log(expected_x) - actual_mean) / (total_var * Math.sqrt(2));
  let inv_cdf = 1 - (erf(erf_input) + 1) * 0.5;
  if (inv_cdf > 0.4) inv_cdf *= 0.9;
  return (
    <div className="divide-y">
      <div className="mb-8">
        <HomeStats
          total_value={total_mean}
          assets={user_info.assets}
          inv_cdf={inv_cdf}
        />
      </div>
      <div className="w-full flex flex-col items-center mb-8">
        <h1 className="text-3xl m-4">Future Price Density Function</h1>
        <MoneyDensity
          mean={special_total_mean}
          std={total_var}
          max={total_max}
          width={500}
          height={250}
          max_mode={get_mode_val(1000, 0.3)}
          labels
          desired={user_info.exp_return}
        />
      </div>
      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-3xl m-4">Recommended Investments</h1>
        <Suggestions recommendations={recommended_stocks} />
      </div>
      <div className="w-full flex flex-col items-center mb-8">
        <h1 className="text-3xl m-4">Portfolio</h1>
        <PortfolioEntries investments={investments} />
      </div>
    </div>
  );
}

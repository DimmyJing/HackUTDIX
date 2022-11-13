import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import PortfolioEntries from "../portfolio_entries";
import EditInvestment from "./edit_investment";
import ExtraOptions from "./extra_options";
import { HOST } from "app/remote";

export default async function Home() {
  const email = cookies().get("email");
  if (email === undefined || email.value === "") redirect("/login");
  const user_info: { exp_return: number; assets: number } = await fetch(
    HOST + "get_user_data/" + email.value
  ).then((data) => data.json());
  const positions = await fetch(HOST + "get_tickers/" + email.value).then(
    (data) => data.json()
  );
  let investments = [];
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
  return (
    <div>
      <ExtraOptions
        email={email.value}
        exp_return={user_info.exp_return}
        assets={user_info.assets}
      />
      <PortfolioEntries
        email={email.value}
        investments={investments}
        modifiable
      />
      <EditInvestment email={email.value} />
    </div>
  );
}

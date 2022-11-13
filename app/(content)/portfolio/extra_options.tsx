"use client";

import { HOST } from "app/remote";
import { useState } from "react";

export default function ExtraOptions({
  email,
  exp_return,
  assets,
}: {
  email: string;
  exp_return: number;
  assets: number;
}) {
  const [expectedReturn, setExpectedReturn] = useState(
    parseFloat(exp_return.toString())
  );
  const [liquidAssets, setLiquidAssets] = useState(
    parseFloat(assets.toString())
  );
  return (
    <div className="w-full flex flex-col items-start">
      <form className="mt-5 sm:mt-6">
        <div>
          <label
            htmlFor="return"
            className="block mt-2 text-sm font-medium text-gray-900"
          >
            Expected Return (Percent)
          </label>
          <input
            type="number"
            id="return"
            value={expectedReturn}
            onChange={(event) =>
              setExpectedReturn(parseInt(event.target.value))
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          />
        </div>
        <div>
          <label
            htmlFor="assets"
            className="block mt-2 text-sm font-medium text-gray-900"
          >
            Liquid Assets (Cash)
          </label>
          <input
            type="number"
            id="assets"
            value={liquidAssets}
            step="any"
            onChange={(event) =>
              setLiquidAssets(parseFloat(event.target.value))
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          />
        </div>
        <div className="flex flex-row">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm mt-4 mb-10"
            onClick={() => {
              fetch(
                HOST +
                  "set_user_data/" +
                  email +
                  "/" +
                  expectedReturn +
                  "/" +
                  liquidAssets
              ).catch((error) => console.log(error));
            }}
          >
            Submit Options
          </button>
        </div>
      </form>
    </div>
  );
}

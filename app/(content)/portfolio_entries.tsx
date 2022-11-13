"use client";

import { Menu, Transition } from "@headlessui/react";
import {
  BoltIcon,
  CheckBadgeIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { HOST } from "app/remote";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { get_mode_val } from "./calculation";
import MoneyDensity from "./money_density";
import EditInvestment from "./portfolio/edit_investment";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PortfolioEntries({
  investments,
  email,
  modifiable,
}: {
  investments: {
    ticker: string;
    type: string;
    amount: number;
    mean: number;
    std: number;
    confidence: number;
  }[];
  email?: string;
  modifiable?: boolean;
}) {
  const router = useRouter();
  const [data, setData] = useState<
    { ticker: string; amount: number; confidence: number } | undefined
  >(undefined);
  const max_mean = investments
    .map((el) => el.mean)
    .reduce((a, b) => Math.max(a, b), -Infinity);
  const max_mode_val = investments.reduce(
    (a, b) => Math.max(a, get_mode_val(b.mean, b.std)),
    -Infinity
  );

  return (
    <div
      className="overflow-hidden bg-white shadow sm:rounded-md"
      style={{ width: "inherit" }}
    >
      <ul role="list" className="divide-y divide-gray-200">
        {investments.map((position) => (
          <div
            className="flex flex-row justify-between items-center"
            key={position.ticker}
          >
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="ml-1 flex items-center justify-begin">
                  <p className="truncate text-xl font-medium text-indigo-600">
                    {position.ticker}
                  </p>
                  <div className="flex flex-shrink-0 ml-2">
                    <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                      {position.type}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <BoltIcon
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    <p>Amount: {position.amount}</p>
                  </div>
                  <div className="ml-1 mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <CheckBadgeIcon
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    <p>Confidence: {position.confidence}</p>
                  </div>
                </div>
              </div>
            </li>
            <div className="flex flex-row">
              <div className="flex flex-col justify-around">
                <MoneyDensity
                  mean={position.mean * (position.confidence / 100 + 1)}
                  std={position.std}
                  max={max_mean * 2}
                  max_mode={max_mode_val}
                />
              </div>
              {modifiable && (
                <>
                  <div className="flex flex-col justify-center items-center">
                    <Menu as="div" className="m-4">
                      <Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <EllipsisHorizontalIcon className="w-8 h-8" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-20 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item key={"Edit"}>
                            {({ active }) => (
                              <a
                                onClick={() => {
                                  setData(undefined);
                                  setData({
                                    ticker: position.ticker,
                                    amount: position.amount,
                                    confidence: position.confidence,
                                  });
                                }}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Edit
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item key={"Remove"}>
                            {({ active }) => (
                              <a
                                onClick={() => {
                                  fetch(
                                    HOST +
                                      "remove_ticker/" +
                                      email +
                                      "/" +
                                      position.ticker
                                  );
                                  router.refresh();
                                }}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Remove
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </ul>
      {data !== undefined && (
        <EditInvestment
          email={email}
          ticker={data.ticker}
          amount={data.amount}
          confidence={data.confidence}
          closeModal={() => setData(undefined)}
        />
      )}
    </div>
  );
}

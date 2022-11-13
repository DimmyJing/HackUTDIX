"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { HOST } from "app/remote";

export default function EditInvestment({
  email,
  ticker,
  amount,
  confidence,
  closeModal,
}: {
  email: string;
  ticker?: string;
  amount?: number;
  confidence?: number;
  closeModal?: () => void;
}) {
  const [open, setOpen] = useState(!!ticker);
  const [tickerVal, setTickerVal] = useState(ticker || "");
  const [amountVal, setAmountVal] = useState(amount || 0);
  const [confidenceVal, setConfidenceVal] = useState(confidence || 0);
  const router = useRouter();

  return (
    <>
      {!ticker && (
        <button
          className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm mb-4"
          onClick={() => setOpen(true)}
        >
          Add Investment
        </button>
      )}

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setOpen(false);
            if (closeModal) closeModal();
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Add/Modify Investment
                      </Dialog.Title>
                    </div>
                  </div>
                  <form className="mt-5 sm:mt-6">
                    <div>
                      <label
                        htmlFor="ticker"
                        className="block text-sm font-medium text-gray-900"
                      >
                        Ticker
                      </label>
                      <input
                        type="text"
                        id="ticker"
                        value={tickerVal}
                        onChange={(event) => setTickerVal(event.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="amount"
                        className="block mt-2 text-sm font-medium text-gray-900"
                      >
                        Amount
                      </label>
                      <input
                        type="number"
                        id="amount"
                        value={amountVal}
                        onChange={(event) =>
                          setAmountVal(parseInt(event.target.value))
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="confidence"
                        className="block text-sm font-medium text-gray-900 mt-2"
                      >
                        Confidence
                      </label>
                      <input
                        id="confidence"
                        type="range"
                        value={confidenceVal}
                        min="-100"
                        max="100"
                        onChange={(event) =>
                          setConfidenceVal(parseInt(event.target.value))
                        }
                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-row">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-indigo-600 shadow-sm hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 sm:text-sm mr-4"
                        onClick={() => {
                          setOpen(false);
                          if (closeModal) closeModal();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                        onClick={() => {
                          setOpen(false);
                          if (closeModal) closeModal();
                          fetch(
                            HOST +
                              "put_ticker/" +
                              email +
                              "/" +
                              tickerVal +
                              "/" +
                              amountVal +
                              "/" +
                              confidenceVal
                          ).catch((error) => console.log(error));
                          router.refresh();
                        }}
                      >
                        {ticker ? "Modify" : "Add"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

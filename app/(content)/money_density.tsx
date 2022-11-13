"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { calculate, get_new_mean } from "./calculation";

function formatYAxis(num: number) {
  return (num * 100).toFixed(2) + "%";
}

function formatXAxis(num: number) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  const result = item
    ? (num / item.value).toFixed(2).replace(rx, "$1") + item.symbol
    : "0";
  console.log(result);
  return result;
}

export default function MoneyDensity({
  mean,
  std,
  max,
  max_mode,
  width,
  height,
  labels,
  desired,
}: {
  mean: number;
  std: number;
  max: number;
  max_mode?: number;
  width?: number;
  height?: number;
  labels?: boolean;
  desired?: number;
}) {
  const step_size = max / 1000;
  const data = Array.from({ length: max / step_size }, (_, i) => ({
    key: i * step_size,
    val: calculate(
      Math.max(i * step_size, 0.001),
      get_new_mean(mean, std),
      std + 0.001
    ),
  }));
  const xTicks = Array.from({ length: 10 }, (_, i) => (i * max) / 10);
  const yTicks = [0, max_mode / 3, (max_mode / 3) * 2].concat(
    labels ? [max_mode] : []
  );
  return (
    <LineChart width={width || 200} height={height || 100} data={data}>
      <Line type="monotone" dataKey="val" stroke="#8884d8" dot={false} />
      <CartesianGrid stroke="#ccc" />
      <XAxis
        dataKey="key"
        domain={[0, max]}
        hide={!labels}
        tickFormatter={formatXAxis}
      />
      <YAxis
        axisLine={false}
        hide={!labels}
        domain={[0, max_mode || "dataMax"]}
        tickFormatter={formatYAxis}
        ticks={yTicks}
      />
      {labels && (
        <>
          <ReferenceLine
            x={mean * (desired / 100 + 1)}
            label="desired"
            stroke="red"
          ></ReferenceLine>
          <ReferenceLine x={mean} />
        </>
      )}
    </LineChart>
  );
}

export function calculate(x: number, mean: number, std: number) {
  return (
    (1 / (Math.sqrt(2 * Math.PI) * std * x)) *
    Math.exp(Math.pow((Math.log(x) - mean) / std, 2) * -0.5)
  );
}

export function get_new_mean(mean: number, std: number) {
  return Math.log(mean) + Math.pow(std, 2);
}

export function get_mode_val(mean: number, std: number) {
  return calculate(mean, get_new_mean(mean, std), std);
}

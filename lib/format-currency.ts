export function formatMinorCurrencyAmount(
  amountMinor: number,
  currency: string
) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  })
  const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 2

  return formatter.format(amountMinor / 10 ** fractionDigits)
}

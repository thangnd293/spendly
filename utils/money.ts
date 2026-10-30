const moneyFormatter = new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 2,
});

export function formatMoney(amount: number) {
	return Number.isFinite(amount) ? moneyFormatter.format(amount) : '0';
}

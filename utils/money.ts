const moneyFormatter = new Intl.NumberFormat('vi-VN', {
	maximumFractionDigits: 2,
});

export function formatMoney(amount: number) {
	return Number.isFinite(amount) ? moneyFormatter.format(amount) : '0';
}

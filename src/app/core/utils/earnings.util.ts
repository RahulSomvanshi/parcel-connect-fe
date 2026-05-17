export const COMPANY_FEE_PERCENT = 20;
export const TRAVELLER_SHARE_PERCENT = 80;

export function splitEarnings(totalAmount: number) {
  const companyShare = Math.round(totalAmount * (COMPANY_FEE_PERCENT / 100));
  const travellerEarning = Math.round(totalAmount - companyShare);
  return { companyShare, travellerEarning, totalAmount };
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount || 0);
}

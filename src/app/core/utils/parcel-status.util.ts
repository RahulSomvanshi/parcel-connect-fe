export type ParcelStatus =
  | 'PENDING'
  | 'MATCHED'
  | 'OPEN'
  | 'ACCEPTED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'searching'
  | 'matched'
  | 'in_transit'
  | 'delivered';

const LABELS: Record<string, string> = {
  PENDING: 'Pending',
  MATCHED: 'Matched',
  OPEN: 'Open',
  ACCEPTED: 'Accepted',
  PICKED_UP: 'Picked up',
  IN_TRANSIT: 'In transit',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
  searching: 'Open',
  matched: 'Accepted',
  in_transit: 'In transit',
  delivered: 'Delivered',
};

const BADGE: Record<string, string> = {
  PENDING: 'secondary',
  OPEN: 'secondary',
  searching: 'secondary',
  MATCHED: 'primary',
  ACCEPTED: 'primary',
  matched: 'primary',
  PICKED_UP: 'primary',
  IN_TRANSIT: 'warning',
  OUT_FOR_DELIVERY: 'warning',
  in_transit: 'warning',
  DELIVERED: 'success',
  delivered: 'success',
  CANCELLED: 'secondary',
  REJECTED: 'danger',
};

export function parcelStatusLabel(status: string): string {
  return LABELS[status] ?? status;
}

export function parcelStatusBadge(status: string): string {
  return BADGE[status] ?? 'secondary';
}

export function isOpenParcel(status: string): boolean {
  return status === 'PENDING' || status === 'OPEN' || status === 'searching';
}

export function isActiveDelivery(status: string): boolean {
  return [
    'MATCHED',
    'ACCEPTED',
    'PICKED_UP',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'matched',
    'in_transit',
  ].includes(
    status
  );
}

export function canMarkDelivered(status: string): boolean {
  return isActiveDelivery(status);
}

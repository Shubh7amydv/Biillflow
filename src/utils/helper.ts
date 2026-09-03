export interface LineItemLike {
  quantity: number | string | { toString(): string };
  rate: number | string | { toString(): string };
}

export interface InvoiceTotals {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
}

export function calculateInvoiceTotals(
  items: LineItemLike[],
  discountPercent: number | string | { toString(): string } = 0,
  taxPercent: number | string | { toString(): string } = 0
): InvoiceTotals {
  const discountPct = Number(discountPercent) || 0;
  const taxPct = Number(taxPercent) || 0;

  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    return sum + qty * rate;
  }, 0);

  const discountAmount = subtotal * (discountPct / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * (taxPct / 100);
  const total = taxableAmount + taxAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    taxableAmount: Math.round(taxableAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export function isInvoiceOverdue(
  status: string,
  dueDate: string | Date | null | undefined
): boolean {
  if (status !== 'SENT' || !dueDate) return false;
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

export function formatInvoiceNumber(
  prefix: string = 'INV',
  year: number = new Date().getFullYear(),
  sequence: number = 1
): string {
  const paddedSeq = String(sequence).padStart(4, '0');
  return `${prefix}-${year}-${paddedSeq}`;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

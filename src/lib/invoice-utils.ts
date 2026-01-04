import { InvoiceData } from '@/components/invoice-templates';
import { BranchSettings } from '@/stores/branch.store';

export interface GenerateInvoiceOptions {
  invoice: InvoiceData;
  branch: BranchSettings;
  template: 'modern' | 'classic' | 'minimalist' | 'premium';
  filename?: string;
}

export function printInvoice() {
  // Use browser's native print functionality
  window.print();
  return { success: true, message: 'Print dialog opened' };
}

export function downloadInvoiceAsImage() {
  // This would require a library like html2canvas
  // For now, users can print to PDF using browser print dialog
  const canvas = document.getElementById('invoice-container');
  if (!canvas) {
    return { success: false, message: 'Invoice container not found' };
  }
  return { success: true, message: 'Invoice can be printed and saved as PDF' };
}

export function generateInvoiceNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `INV-${new Date().getFullYear()}-${String(random).padStart(5, '0')}`;
}

export function calculateInvoiceTotal(
  servicePrice: number,
  products?: Array<{ price: number; quantity: number }>,
  taxRate: number = 5,
  discount: number = 0
) {
  let subtotal = servicePrice;

  if (products && products.length > 0) {
    const productsTotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    subtotal += productsTotal;
  }

  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;

  return {
    subtotal,
    discount: discountAmount,
    tax: taxAmount,
    total: taxableAmount + taxAmount
  };
}

export function formatCurrencyAED(amount: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function sendInvoiceEmail(
  email: string,
  invoiceNumber: string,
  branchName: string
) {
  // This would integrate with your backend email service
  const formData = new FormData();
  formData.append('email', email);
  formData.append('invoiceNumber', invoiceNumber);
  formData.append('branchName', branchName);

  return fetch('/api/send-invoice', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .catch(err => ({
      success: false,
      message: 'Failed to send invoice email',
      error: err
    }));
}

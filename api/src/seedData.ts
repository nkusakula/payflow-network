import { Issuer } from './models/issuer';
import { Cardholder } from './models/cardholder';
import { Card } from './models/card';
import { Merchant } from './models/merchant';
import { Transaction } from './models/transaction';
import { Dispute } from './models/dispute';
import { Settlement } from './models/settlement';

export let issuers: Issuer[] = [
  { id: 'ISS001', name: 'First National Bank', country: 'US', bankCode: '541200', currency: 'USD', status: 'active', contactEmail: 'network@fnb.com', enrolledAt: '2020-01-15T08:00:00Z' },
  { id: 'ISS002', name: 'Pacific Credit Union', country: 'US', bankCode: '524300', currency: 'USD', status: 'active', contactEmail: 'ops@pacificcu.com', enrolledAt: '2019-06-20T09:00:00Z' },
  { id: 'ISS003', name: 'Metropolitan Bank', country: 'GB', bankCode: '676100', currency: 'GBP', status: 'active', contactEmail: 'payments@metrobank.co.uk', enrolledAt: '2021-03-10T10:00:00Z' },
  { id: 'ISS004', name: 'Sunrise Financial', country: 'CA', bankCode: '453900', currency: 'CAD', status: 'active', contactEmail: 'network@sunrisefin.ca', enrolledAt: '2020-09-01T07:00:00Z' },
  { id: 'ISS005', name: 'Liberty Trust Bank', country: 'AU', bankCode: '512800', currency: 'AUD', status: 'suspended', contactEmail: 'ops@libertytrust.com.au', enrolledAt: '2018-11-25T06:00:00Z' },
];

export let cardholders: Cardholder[] = [
  { id: 'CH001', firstName: 'Alexandra', lastName: 'Chen', email: 'a.chen@email.com', phone: '+1-555-0101', country: 'US', issuerId: 'ISS001', status: 'active', createdAt: '2021-04-10T10:00:00Z' },
  { id: 'CH002', firstName: 'Marcus', lastName: 'Johnson', email: 'm.johnson@email.com', phone: '+1-555-0102', country: 'US', issuerId: 'ISS001', status: 'active', createdAt: '2021-07-22T11:00:00Z' },
  { id: 'CH003', firstName: 'Priya', lastName: 'Patel', email: 'p.patel@email.com', phone: '+1-555-0103', country: 'US', issuerId: 'ISS002', status: 'active', createdAt: '2022-01-05T09:00:00Z' },
  { id: 'CH004', firstName: 'Oliver', lastName: 'Williams', email: 'o.williams@email.com', phone: '+44-20-0104', country: 'GB', issuerId: 'ISS003', status: 'active', createdAt: '2022-03-18T14:00:00Z' },
  { id: 'CH005', firstName: 'Sophie', lastName: 'Tremblay', email: 's.tremblay@email.com', phone: '+1-416-0105', country: 'CA', issuerId: 'ISS004', status: 'active', createdAt: '2022-06-30T08:00:00Z' },
  { id: 'CH006', firstName: 'David', lastName: 'Kim', email: 'd.kim@email.com', phone: '+1-555-0106', country: 'US', issuerId: 'ISS002', status: 'blocked', createdAt: '2020-12-01T10:00:00Z' },
  { id: 'CH007', firstName: 'Emma', lastName: 'Garcia', email: 'e.garcia@email.com', phone: '+1-555-0107', country: 'US', issuerId: 'ISS001', status: 'active', createdAt: '2023-02-14T12:00:00Z' },
  { id: 'CH008', firstName: 'Liam', lastName: 'Foster', email: 'l.foster@email.com', phone: '+61-2-0108', country: 'AU', issuerId: 'ISS005', status: 'active', createdAt: '2021-09-10T07:00:00Z' },
];

export let cards: Card[] = [
  { id: 'CRD001', cardholderId: 'CH001', issuerId: 'ISS001', maskedPan: '5412 **** **** 3456', cardType: 'credit', productTier: 'world_elite', status: 'active', expiryDate: '12/27', creditLimit: 1500000, issuedAt: '2021-04-15T10:00:00Z' },
  { id: 'CRD002', cardholderId: 'CH001', issuerId: 'ISS001', maskedPan: '5412 **** **** 7891', cardType: 'debit', productTier: 'standard', status: 'active', expiryDate: '12/26', creditLimit: 0, issuedAt: '2021-04-15T10:00:00Z' },
  { id: 'CRD003', cardholderId: 'CH002', issuerId: 'ISS001', maskedPan: '5412 **** **** 2233', cardType: 'credit', productTier: 'platinum', status: 'active', expiryDate: '08/26', creditLimit: 500000, issuedAt: '2021-07-25T11:00:00Z' },
  { id: 'CRD004', cardholderId: 'CH003', issuerId: 'ISS002', maskedPan: '5243 **** **** 4567', cardType: 'credit', productTier: 'gold', status: 'active', expiryDate: '03/28', creditLimit: 300000, issuedAt: '2022-01-10T09:00:00Z' },
  { id: 'CRD005', cardholderId: 'CH004', issuerId: 'ISS003', maskedPan: '6761 **** **** 8901', cardType: 'credit', productTier: 'world', status: 'active', expiryDate: '06/27', creditLimit: 800000, issuedAt: '2022-03-20T14:00:00Z' },
  { id: 'CRD006', cardholderId: 'CH005', issuerId: 'ISS004', maskedPan: '4539 **** **** 1234', cardType: 'debit', productTier: 'standard', status: 'active', expiryDate: '09/25', creditLimit: 0, issuedAt: '2022-07-01T08:00:00Z' },
  { id: 'CRD007', cardholderId: 'CH006', issuerId: 'ISS002', maskedPan: '5243 **** **** 9012', cardType: 'credit', productTier: 'standard', status: 'blocked', expiryDate: '04/26', creditLimit: 100000, issuedAt: '2021-01-05T10:00:00Z' },
  { id: 'CRD008', cardholderId: 'CH007', issuerId: 'ISS001', maskedPan: '5412 **** **** 5678', cardType: 'prepaid', productTier: 'standard', status: 'active', expiryDate: '02/28', creditLimit: 0, issuedAt: '2023-02-14T12:00:00Z' },
];

export let merchants: Merchant[] = [
  { id: 'MER001', name: 'TechMart Electronics', mcc: '5734', category: 'Electronics Stores', country: 'US', city: 'San Francisco', acquirerId: 'ACQ001', status: 'active', acceptedCardTypes: ['credit', 'debit', 'prepaid'], enrolledAt: '2019-01-10T08:00:00Z' },
  { id: 'MER002', name: 'Global Air Travel', mcc: '4511', category: 'Airlines', country: 'US', city: 'New York', acquirerId: 'ACQ001', status: 'active', acceptedCardTypes: ['credit', 'debit'], enrolledAt: '2018-06-15T09:00:00Z' },
  { id: 'MER003', name: 'Harbour Hotel Group', mcc: '7011', category: 'Hotels & Lodging', country: 'GB', city: 'London', acquirerId: 'ACQ002', status: 'active', acceptedCardTypes: ['credit', 'debit'], enrolledAt: '2020-02-20T10:00:00Z' },
  { id: 'MER004', name: 'FreshMarket Grocery', mcc: '5411', category: 'Grocery Stores', country: 'US', city: 'Chicago', acquirerId: 'ACQ001', status: 'active', acceptedCardTypes: ['credit', 'debit', 'prepaid'], enrolledAt: '2017-11-05T07:00:00Z' },
  { id: 'MER005', name: 'Prime Stream Services', mcc: '7372', category: 'Online Services', country: 'US', city: 'Seattle', acquirerId: 'ACQ003', status: 'active', acceptedCardTypes: ['credit', 'debit', 'prepaid'], enrolledAt: '2021-05-12T11:00:00Z' },
  { id: 'MER006', name: 'Metro Fuel Stations', mcc: '5541', category: 'Service Stations', country: 'CA', city: 'Toronto', acquirerId: 'ACQ002', status: 'active', acceptedCardTypes: ['credit', 'debit'], enrolledAt: '2019-08-22T06:00:00Z' },
  { id: 'MER007', name: 'Bistro Centrale', mcc: '5812', category: 'Eating Places', country: 'FR', city: 'Paris', acquirerId: 'ACQ004', status: 'active', acceptedCardTypes: ['credit', 'debit'], enrolledAt: '2022-04-01T12:00:00Z' },
  { id: 'MER008', name: 'QuickCash ATM Network', mcc: '6011', category: 'Automated Cash Dispensers', country: 'US', city: 'Various', acquirerId: 'ACQ001', status: 'suspended', acceptedCardTypes: ['credit', 'debit'], enrolledAt: '2016-03-30T08:00:00Z' },
];

export let transactions: Transaction[] = [
  { id: 'TXN001', cardId: 'CRD001', merchantId: 'MER001', amount: 149999, currency: 'USD', status: 'settled', type: 'purchase', authCode: 'A12345', riskScore: 8, transactedAt: '2024-05-01T14:23:00Z', settledAt: '2024-05-02T03:00:00Z' },
  { id: 'TXN002', cardId: 'CRD003', merchantId: 'MER002', amount: 45600, currency: 'USD', status: 'approved', type: 'purchase', authCode: 'B67890', riskScore: 12, transactedAt: '2024-05-02T09:10:00Z' },
  { id: 'TXN003', cardId: 'CRD004', merchantId: 'MER003', amount: 28000, currency: 'GBP', status: 'settled', type: 'purchase', authCode: 'C11111', riskScore: 5, transactedAt: '2024-04-28T18:45:00Z', settledAt: '2024-04-29T03:00:00Z' },
  { id: 'TXN004', cardId: 'CRD002', merchantId: 'MER004', amount: 8750, currency: 'USD', status: 'settled', type: 'purchase', authCode: 'D22222', riskScore: 3, transactedAt: '2024-05-01T11:30:00Z', settledAt: '2024-05-02T03:00:00Z' },
  { id: 'TXN005', cardId: 'CRD007', merchantId: 'MER005', amount: 1499, currency: 'USD', status: 'declined', type: 'purchase', authCode: '', declineReason: 'Card blocked', riskScore: 95, transactedAt: '2024-05-03T20:00:00Z' },
  { id: 'TXN006', cardId: 'CRD005', merchantId: 'MER007', amount: 6200, currency: 'EUR', status: 'approved', type: 'purchase', authCode: 'E33333', riskScore: 18, transactedAt: '2024-05-03T19:15:00Z' },
  { id: 'TXN007', cardId: 'CRD001', merchantId: 'MER002', amount: 98500, currency: 'USD', status: 'settled', type: 'purchase', authCode: 'F44444', riskScore: 22, transactedAt: '2024-04-25T07:00:00Z', settledAt: '2024-04-26T03:00:00Z' },
  { id: 'TXN008', cardId: 'CRD006', merchantId: 'MER006', amount: 5200, currency: 'CAD', status: 'settled', type: 'purchase', authCode: 'G55555', riskScore: 7, transactedAt: '2024-05-01T08:20:00Z', settledAt: '2024-05-02T03:00:00Z' },
  { id: 'TXN009', cardId: 'CRD003', merchantId: 'MER001', amount: 79999, currency: 'USD', status: 'reversed', type: 'purchase', authCode: 'H66666', riskScore: 10, transactedAt: '2024-04-30T16:00:00Z' },
  { id: 'TXN010', cardId: 'CRD003', merchantId: 'MER001', amount: 79999, currency: 'USD', status: 'settled', type: 'refund', authCode: 'H66667', riskScore: 2, transactedAt: '2024-04-30T16:30:00Z', settledAt: '2024-05-01T03:00:00Z' },
  { id: 'TXN011', cardId: 'CRD008', merchantId: 'MER005', amount: 999, currency: 'USD', status: 'approved', type: 'purchase', authCode: 'I77777', riskScore: 4, transactedAt: '2024-05-04T10:00:00Z' },
  { id: 'TXN012', cardId: 'CRD001', merchantId: 'MER004', amount: 12300, currency: 'USD', status: 'pending', type: 'purchase', authCode: 'J88888', riskScore: 15, transactedAt: '2024-05-04T12:00:00Z' },
];

export let disputes: Dispute[] = [
  { id: 'DSP001', transactionId: 'TXN007', cardholderId: 'CH001', reason: 'fraud', status: 'under_review', description: 'Cardholder denies authorizing this airline purchase.', amountDisputed: 98500, filedAt: '2024-04-28T09:00:00Z' },
  { id: 'DSP002', transactionId: 'TXN003', cardholderId: 'CH003', reason: 'incorrect_amount', status: 'resolved_cardholder', description: 'Charged £280 instead of £250.', amountDisputed: 3000, resolution: 'Refund issued for £30 difference.', filedAt: '2024-04-30T14:00:00Z', resolvedAt: '2024-05-02T16:00:00Z' },
  { id: 'DSP003', transactionId: 'TXN002', cardholderId: 'CH002', reason: 'not_received', status: 'open', description: 'Ticket purchased but no confirmation received.', amountDisputed: 45600, filedAt: '2024-05-04T11:00:00Z' },
  { id: 'DSP004', transactionId: 'TXN011', cardholderId: 'CH007', reason: 'cancelled_subscription', status: 'resolved_merchant', description: 'Subscription was cancelled but still charged.', amountDisputed: 999, resolution: 'Merchant confirmed subscription active at time of charge.', filedAt: '2024-05-04T13:00:00Z', resolvedAt: '2024-05-04T17:00:00Z' },
  { id: 'DSP005', transactionId: 'TXN001', cardholderId: 'CH001', reason: 'duplicate', status: 'closed', description: 'Possible duplicate charge for electronics purchase.', amountDisputed: 149999, resolution: 'Investigation found single charge. Closed.', filedAt: '2024-05-02T08:00:00Z', resolvedAt: '2024-05-03T15:00:00Z' },
];

export let settlements: Settlement[] = [
  { id: 'SET001', issuerId: 'ISS001', settlementDate: '2024-05-02', totalTransactions: 3, totalAmount: 259049, currency: 'USD', feesCharged: 2073, netAmount: 256976, status: 'completed', processedAt: '2024-05-02T04:00:00Z' },
  { id: 'SET002', issuerId: 'ISS002', settlementDate: '2024-05-02', totalTransactions: 1, totalAmount: 8750, currency: 'USD', feesCharged: 70, netAmount: 8680, status: 'completed', processedAt: '2024-05-02T04:15:00Z' },
  { id: 'SET003', issuerId: 'ISS003', settlementDate: '2024-04-29', totalTransactions: 1, totalAmount: 28000, currency: 'GBP', feesCharged: 224, netAmount: 27776, status: 'completed', processedAt: '2024-04-29T04:00:00Z' },
  { id: 'SET004', issuerId: 'ISS004', settlementDate: '2024-05-02', totalTransactions: 1, totalAmount: 5200, currency: 'CAD', feesCharged: 42, netAmount: 5158, status: 'completed', processedAt: '2024-05-02T04:30:00Z' },
  { id: 'SET005', issuerId: 'ISS001', settlementDate: '2024-05-04', totalTransactions: 0, totalAmount: 0, currency: 'USD', feesCharged: 0, netAmount: 0, status: 'pending' },
];

export function resetIssuers() { issuers = [...issuers]; }
export function resetCardholders() { cardholders = [...cardholders]; }
export function resetCards() { cards = [...cards]; }
export function resetMerchants() { merchants = [...merchants]; }
export function resetTransactions() { transactions = [...transactions]; }
export function resetDisputes() { disputes = [...disputes]; }
export function resetSettlements() { settlements = [...settlements]; }

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
  { id: 'CH009', firstName: 'Isabella', lastName: 'Rossi', email: 'i.rossi@email.com', phone: '+39-06-0109', country: 'IT', issuerId: 'ISS003', status: 'active', createdAt: '2023-05-12T10:00:00Z' },
  { id: 'CH010', firstName: 'Noah', lastName: 'Andersen', email: 'n.andersen@email.com', phone: '+45-33-0110', country: 'DK', issuerId: 'ISS003', status: 'active', createdAt: '2023-08-21T09:00:00Z' },
  { id: 'CH011', firstName: 'Maya', lastName: 'Singh', email: 'm.singh@email.com', phone: '+1-555-0111', country: 'US', issuerId: 'ISS001', status: 'active', createdAt: '2024-01-08T13:00:00Z' },
  { id: 'CH012', firstName: 'Lucas', lastName: 'Martinez', email: 'l.martinez@email.com', phone: '+1-555-0112', country: 'US', issuerId: 'ISS002', status: 'active', createdAt: '2023-11-03T11:00:00Z' },
  { id: 'CH013', firstName: 'Aisha', lastName: 'Nakamura', email: 'a.nakamura@email.com', phone: '+1-555-0113', country: 'US', issuerId: 'ISS001', status: 'active', createdAt: '2024-02-19T08:00:00Z' },
  { id: 'CH014', firstName: 'Ethan', lastName: 'Brown', email: 'e.brown@email.com', phone: '+1-416-0114', country: 'CA', issuerId: 'ISS004', status: 'active', createdAt: '2023-09-27T10:00:00Z' },
  { id: 'CH015', firstName: 'Zara', lastName: 'O\'Connor', email: 'z.oconnor@email.com', phone: '+44-20-0115', country: 'GB', issuerId: 'ISS003', status: 'active', createdAt: '2024-03-04T15:00:00Z' },
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
  { id: 'CRD009', cardholderId: 'CH009', issuerId: 'ISS003', maskedPan: '6761 **** **** 2244', cardType: 'credit', productTier: 'platinum', status: 'active', expiryDate: '11/27', creditLimit: 600000, issuedAt: '2023-05-15T10:00:00Z' },
  { id: 'CRD010', cardholderId: 'CH010', issuerId: 'ISS003', maskedPan: '6761 **** **** 5566', cardType: 'credit', productTier: 'gold', status: 'active', expiryDate: '07/28', creditLimit: 350000, issuedAt: '2023-08-25T09:00:00Z' },
  { id: 'CRD011', cardholderId: 'CH011', issuerId: 'ISS001', maskedPan: '5412 **** **** 7700', cardType: 'credit', productTier: 'world', status: 'active', expiryDate: '01/29', creditLimit: 750000, issuedAt: '2024-01-12T13:00:00Z' },
  { id: 'CRD012', cardholderId: 'CH012', issuerId: 'ISS002', maskedPan: '5243 **** **** 8821', cardType: 'credit', productTier: 'standard', status: 'active', expiryDate: '10/27', creditLimit: 200000, issuedAt: '2023-11-05T11:00:00Z' },
  { id: 'CRD013', cardholderId: 'CH013', issuerId: 'ISS001', maskedPan: '5412 **** **** 9933', cardType: 'debit', productTier: 'standard', status: 'active', expiryDate: '02/29', creditLimit: 0, issuedAt: '2024-02-22T08:00:00Z' },
  { id: 'CRD014', cardholderId: 'CH014', issuerId: 'ISS004', maskedPan: '4539 **** **** 4477', cardType: 'credit', productTier: 'gold', status: 'active', expiryDate: '09/28', creditLimit: 400000, issuedAt: '2023-10-01T10:00:00Z' },
  { id: 'CRD015', cardholderId: 'CH015', issuerId: 'ISS003', maskedPan: '6761 **** **** 6622', cardType: 'credit', productTier: 'world_elite', status: 'active', expiryDate: '03/29', creditLimit: 2000000, issuedAt: '2024-03-08T15:00:00Z' },
  { id: 'CRD016', cardholderId: 'CH002', issuerId: 'ISS001', maskedPan: '5412 **** **** 1100', cardType: 'credit', productTier: 'world', status: 'expired', expiryDate: '01/24', creditLimit: 600000, issuedAt: '2020-01-15T10:00:00Z' },
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
  { id: 'MER009', name: 'Apex Fitness Club', mcc: '7997', category: 'Health Clubs', country: 'US', city: 'Austin', acquirerId: 'ACQ001', status: 'active', acceptedCardTypes: ['credit', 'debit'], enrolledAt: '2022-09-15T09:00:00Z' },
  { id: 'MER010', name: 'Skyline Rideshare', mcc: '4121', category: 'Taxicabs & Limousines', country: 'US', city: 'Various', acquirerId: 'ACQ003', status: 'active', acceptedCardTypes: ['credit', 'debit', 'prepaid'], enrolledAt: '2020-07-10T08:00:00Z' },
  { id: 'MER011', name: 'Nordic Books & More', mcc: '5942', category: 'Book Stores', country: 'DK', city: 'Copenhagen', acquirerId: 'ACQ004', status: 'active', acceptedCardTypes: ['credit', 'debit'], enrolledAt: '2021-04-22T10:00:00Z' },
  { id: 'MER012', name: 'Vela Wine Imports', mcc: '5921', category: 'Package Stores - Beer/Wine/Liquor', country: 'IT', city: 'Milan', acquirerId: 'ACQ004', status: 'active', acceptedCardTypes: ['credit', 'debit'], enrolledAt: '2023-01-18T11:00:00Z' },
  { id: 'MER013', name: 'Greenleaf Pharmacy', mcc: '5912', category: 'Drug Stores & Pharmacies', country: 'US', city: 'Boston', acquirerId: 'ACQ001', status: 'active', acceptedCardTypes: ['credit', 'debit', 'prepaid'], enrolledAt: '2020-11-12T08:00:00Z' },
  { id: 'MER014', name: 'CloudHost Solutions', mcc: '7372', category: 'Online Services', country: 'US', city: 'San Jose', acquirerId: 'ACQ003', status: 'active', acceptedCardTypes: ['credit', 'debit'], enrolledAt: '2019-12-03T10:00:00Z' },
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
  { id: 'TXN013', cardId: 'CRD009', merchantId: 'MER003', amount: 42500, currency: 'GBP', status: 'settled', type: 'purchase', authCode: 'K10001', riskScore: 11, transactedAt: '2024-04-22T13:30:00Z', settledAt: '2024-04-23T03:00:00Z' },
  { id: 'TXN014', cardId: 'CRD011', merchantId: 'MER001', amount: 219900, currency: 'USD', status: 'settled', type: 'purchase', authCode: 'K10002', riskScore: 28, transactedAt: '2024-04-23T10:15:00Z', settledAt: '2024-04-24T03:00:00Z' },
  { id: 'TXN015', cardId: 'CRD012', merchantId: 'MER013', amount: 4275, currency: 'USD', status: 'settled', type: 'purchase', authCode: 'K10003', riskScore: 6, transactedAt: '2024-04-24T16:40:00Z', settledAt: '2024-04-25T03:00:00Z' },
  { id: 'TXN016', cardId: 'CRD013', merchantId: 'MER010', amount: 1850, currency: 'USD', status: 'settled', type: 'purchase', authCode: 'K10004', riskScore: 14, transactedAt: '2024-04-25T22:05:00Z', settledAt: '2024-04-26T03:00:00Z' },
  { id: 'TXN017', cardId: 'CRD014', merchantId: 'MER006', amount: 8900, currency: 'CAD', status: 'settled', type: 'purchase', authCode: 'K10005', riskScore: 9, transactedAt: '2024-04-26T07:20:00Z', settledAt: '2024-04-27T03:00:00Z' },
  { id: 'TXN018', cardId: 'CRD015', merchantId: 'MER003', amount: 62500, currency: 'GBP', status: 'settled', type: 'purchase', authCode: 'K10006', riskScore: 17, transactedAt: '2024-04-26T19:50:00Z', settledAt: '2024-04-27T03:00:00Z' },
  { id: 'TXN019', cardId: 'CRD010', merchantId: 'MER011', amount: 3200, currency: 'EUR', status: 'settled', type: 'purchase', authCode: 'K10007', riskScore: 4, transactedAt: '2024-04-27T11:00:00Z', settledAt: '2024-04-28T03:00:00Z' },
  { id: 'TXN020', cardId: 'CRD009', merchantId: 'MER012', amount: 18500, currency: 'EUR', status: 'settled', type: 'purchase', authCode: 'K10008', riskScore: 21, transactedAt: '2024-04-27T20:30:00Z', settledAt: '2024-04-28T03:00:00Z' },
  { id: 'TXN021', cardId: 'CRD011', merchantId: 'MER014', amount: 25000, currency: 'USD', status: 'settled', type: 'purchase', authCode: 'K10009', riskScore: 13, transactedAt: '2024-04-28T08:00:00Z', settledAt: '2024-04-29T03:00:00Z' },
  { id: 'TXN022', cardId: 'CRD003', merchantId: 'MER009', amount: 5999, currency: 'USD', status: 'settled', type: 'purchase', authCode: 'K10010', riskScore: 7, transactedAt: '2024-04-29T17:45:00Z', settledAt: '2024-04-30T03:00:00Z' },
  { id: 'TXN023', cardId: 'CRD007', merchantId: 'MER001', amount: 89999, currency: 'USD', status: 'declined', type: 'purchase', authCode: '', declineReason: 'Suspected fraud', riskScore: 88, transactedAt: '2024-04-29T23:10:00Z' },
  { id: 'TXN024', cardId: 'CRD012', merchantId: 'MER010', amount: 2350, currency: 'USD', status: 'settled', type: 'purchase', authCode: 'K10011', riskScore: 8, transactedAt: '2024-04-30T07:55:00Z', settledAt: '2024-05-01T03:00:00Z' },
  { id: 'TXN025', cardId: 'CRD004', merchantId: 'MER013', amount: 7820, currency: 'USD', status: 'settled', type: 'purchase', authCode: 'K10012', riskScore: 5, transactedAt: '2024-04-30T14:25:00Z', settledAt: '2024-05-01T03:00:00Z' },
  { id: 'TXN026', cardId: 'CRD016', merchantId: 'MER002', amount: 56000, currency: 'USD', status: 'declined', type: 'purchase', authCode: '', declineReason: 'Card expired', riskScore: 35, transactedAt: '2024-04-30T18:00:00Z' },
  { id: 'TXN027', cardId: 'CRD001', merchantId: 'MER014', amount: 49900, currency: 'USD', status: 'settled', type: 'purchase', authCode: 'K10013', riskScore: 16, transactedAt: '2024-05-01T09:30:00Z', settledAt: '2024-05-02T03:00:00Z' },
  { id: 'TXN028', cardId: 'CRD005', merchantId: 'MER012', amount: 14200, currency: 'EUR', status: 'approved', type: 'purchase', authCode: 'K10014', riskScore: 19, transactedAt: '2024-05-01T20:00:00Z' },
  { id: 'TXN029', cardId: 'CRD013', merchantId: 'MER004', amount: 6450, currency: 'USD', status: 'settled', type: 'purchase', authCode: 'K10015', riskScore: 3, transactedAt: '2024-05-02T11:10:00Z', settledAt: '2024-05-03T03:00:00Z' },
  { id: 'TXN030', cardId: 'CRD011', merchantId: 'MER005', amount: 1599, currency: 'USD', status: 'approved', type: 'purchase', authCode: 'K10016', riskScore: 6, transactedAt: '2024-05-02T15:35:00Z' },
  { id: 'TXN031', cardId: 'CRD014', merchantId: 'MER010', amount: 4180, currency: 'CAD', status: 'approved', type: 'purchase', authCode: 'K10017', riskScore: 12, transactedAt: '2024-05-02T22:50:00Z' },
  { id: 'TXN032', cardId: 'CRD010', merchantId: 'MER011', amount: 2700, currency: 'EUR', status: 'approved', type: 'purchase', authCode: 'K10018', riskScore: 5, transactedAt: '2024-05-03T08:40:00Z' },
  { id: 'TXN033', cardId: 'CRD003', merchantId: 'MER001', amount: 134500, currency: 'USD', status: 'approved', type: 'purchase', authCode: 'K10019', riskScore: 24, transactedAt: '2024-05-03T13:20:00Z' },
  { id: 'TXN034', cardId: 'CRD009', merchantId: 'MER003', amount: 38900, currency: 'GBP', status: 'approved', type: 'purchase', authCode: 'K10020', riskScore: 10, transactedAt: '2024-05-03T17:15:00Z' },
  { id: 'TXN035', cardId: 'CRD007', merchantId: 'MER013', amount: 3200, currency: 'USD', status: 'declined', type: 'purchase', authCode: '', declineReason: 'Insufficient funds', riskScore: 72, transactedAt: '2024-05-03T21:05:00Z' },
  { id: 'TXN036', cardId: 'CRD002', merchantId: 'MER001', amount: 45000, currency: 'USD', status: 'approved', type: 'cash_advance', authCode: 'K10021', riskScore: 65, transactedAt: '2024-05-04T06:30:00Z' },
  { id: 'TXN037', cardId: 'CRD015', merchantId: 'MER007', amount: 22800, currency: 'EUR', status: 'pending', type: 'purchase', authCode: 'K10022', riskScore: 11, transactedAt: '2024-05-04T11:25:00Z' },
  { id: 'TXN038', cardId: 'CRD011', merchantId: 'MER009', amount: 12900, currency: 'USD', status: 'approved', type: 'purchase', authCode: 'K10023', riskScore: 9, transactedAt: '2024-05-04T13:45:00Z' },
  { id: 'TXN039', cardId: 'CRD012', merchantId: 'MER014', amount: 9999, currency: 'USD', status: 'pending', type: 'purchase', authCode: 'K10024', riskScore: 18, transactedAt: '2024-05-04T15:00:00Z' },
  { id: 'TXN040', cardId: 'CRD005', merchantId: 'MER003', amount: 41200, currency: 'GBP', status: 'pending', type: 'purchase', authCode: 'K10025', riskScore: 14, transactedAt: '2024-05-04T16:10:00Z' },
];

export let disputes: Dispute[] = [
  { id: 'DSP001', transactionId: 'TXN007', cardholderId: 'CH001', reason: 'fraud', status: 'under_review', description: 'Cardholder denies authorizing this airline purchase.', amountDisputed: 98500, filedAt: '2024-04-28T09:00:00Z' },
  { id: 'DSP002', transactionId: 'TXN003', cardholderId: 'CH003', reason: 'incorrect_amount', status: 'resolved_cardholder', description: 'Charged £280 instead of £250.', amountDisputed: 3000, resolution: 'Refund issued for £30 difference.', filedAt: '2024-04-30T14:00:00Z', resolvedAt: '2024-05-02T16:00:00Z' },
  { id: 'DSP003', transactionId: 'TXN002', cardholderId: 'CH002', reason: 'not_received', status: 'open', description: 'Ticket purchased but no confirmation received.', amountDisputed: 45600, filedAt: '2024-05-04T11:00:00Z' },
  { id: 'DSP004', transactionId: 'TXN011', cardholderId: 'CH007', reason: 'cancelled_subscription', status: 'resolved_merchant', description: 'Subscription was cancelled but still charged.', amountDisputed: 999, resolution: 'Merchant confirmed subscription active at time of charge.', filedAt: '2024-05-04T13:00:00Z', resolvedAt: '2024-05-04T17:00:00Z' },
  { id: 'DSP005', transactionId: 'TXN001', cardholderId: 'CH001', reason: 'duplicate', status: 'closed', description: 'Possible duplicate charge for electronics purchase.', amountDisputed: 149999, resolution: 'Investigation found single charge. Closed.', filedAt: '2024-05-02T08:00:00Z', resolvedAt: '2024-05-03T15:00:00Z' },
  { id: 'DSP006', transactionId: 'TXN014', cardholderId: 'CH011', reason: 'fraud', status: 'open', description: 'Cardholder reports unauthorized $2,199 electronics purchase.', amountDisputed: 219900, filedAt: '2024-04-25T10:00:00Z' },
  { id: 'DSP007', transactionId: 'TXN023', cardholderId: 'CH006', reason: 'fraud', status: 'under_review', description: 'High-risk declined attempt; customer disputes any knowledge of activity.', amountDisputed: 89999, filedAt: '2024-04-30T09:30:00Z' },
  { id: 'DSP008', transactionId: 'TXN020', cardholderId: 'CH009', reason: 'incorrect_amount', status: 'open', description: 'Charged €185 vs €175 stated on receipt.', amountDisputed: 1000, filedAt: '2024-05-01T14:00:00Z' },
  { id: 'DSP009', transactionId: 'TXN036', cardholderId: 'CH001', reason: 'fraud', status: 'open', description: 'Cash advance not initiated by cardholder.', amountDisputed: 45000, filedAt: '2024-05-04T08:00:00Z' },
  { id: 'DSP010', transactionId: 'TXN025', cardholderId: 'CH003', reason: 'cancelled_subscription', status: 'resolved_cardholder', description: 'Pharmacy subscription was cancelled prior to charge.', amountDisputed: 7820, resolution: 'Refund issued in full.', filedAt: '2024-05-02T11:00:00Z', resolvedAt: '2024-05-03T18:00:00Z' },
];

export let settlements: Settlement[] = [
  { id: 'SET001', issuerId: 'ISS001', settlementDate: '2024-05-02', totalTransactions: 3, totalAmount: 259049, currency: 'USD', feesCharged: 2073, netAmount: 256976, status: 'completed', processedAt: '2024-05-02T04:00:00Z' },
  { id: 'SET002', issuerId: 'ISS002', settlementDate: '2024-05-02', totalTransactions: 1, totalAmount: 8750, currency: 'USD', feesCharged: 70, netAmount: 8680, status: 'completed', processedAt: '2024-05-02T04:15:00Z' },
  { id: 'SET003', issuerId: 'ISS003', settlementDate: '2024-04-29', totalTransactions: 1, totalAmount: 28000, currency: 'GBP', feesCharged: 224, netAmount: 27776, status: 'completed', processedAt: '2024-04-29T04:00:00Z' },
  { id: 'SET004', issuerId: 'ISS004', settlementDate: '2024-05-02', totalTransactions: 1, totalAmount: 5200, currency: 'CAD', feesCharged: 42, netAmount: 5158, status: 'completed', processedAt: '2024-05-02T04:30:00Z' },
  { id: 'SET005', issuerId: 'ISS001', settlementDate: '2024-05-04', totalTransactions: 0, totalAmount: 0, currency: 'USD', feesCharged: 0, netAmount: 0, status: 'pending' },
  { id: 'SET006', issuerId: 'ISS001', settlementDate: '2024-04-24', totalTransactions: 1, totalAmount: 219900, currency: 'USD', feesCharged: 1759, netAmount: 218141, status: 'completed', processedAt: '2024-04-24T04:00:00Z' },
  { id: 'SET007', issuerId: 'ISS003', settlementDate: '2024-04-23', totalTransactions: 1, totalAmount: 42500, currency: 'GBP', feesCharged: 340, netAmount: 42160, status: 'completed', processedAt: '2024-04-23T04:00:00Z' },
  { id: 'SET008', issuerId: 'ISS003', settlementDate: '2024-04-28', totalTransactions: 2, totalAmount: 21700, currency: 'EUR', feesCharged: 174, netAmount: 21526, status: 'completed', processedAt: '2024-04-28T04:00:00Z' },
  { id: 'SET009', issuerId: 'ISS004', settlementDate: '2024-04-27', totalTransactions: 1, totalAmount: 8900, currency: 'CAD', feesCharged: 71, netAmount: 8829, status: 'completed', processedAt: '2024-04-27T04:00:00Z' },
  { id: 'SET010', issuerId: 'ISS002', settlementDate: '2024-05-04', totalTransactions: 0, totalAmount: 0, currency: 'USD', feesCharged: 0, netAmount: 0, status: 'processing' },
];

export function resetIssuers() { issuers = [...issuers]; }
export function resetCardholders() { cardholders = [...cardholders]; }
export function resetCards() { cards = [...cards]; }
export function resetMerchants() { merchants = [...merchants]; }
export function resetTransactions() { transactions = [...transactions]; }
export function resetDisputes() { disputes = [...disputes]; }
export function resetSettlements() { settlements = [...settlements]; }

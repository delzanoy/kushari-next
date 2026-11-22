import { Transaction, Recipient, TransactionWithCalculations } from './types';
import { AddressCardProps } from '@/components/molecules/address-book/addresses/types';

export const determineMultirecipients = (
    isMulti: boolean, 
    recipients: Recipient | Recipient[] | string, 
    addresses: AddressCardProps[]
): string => {
    if (typeof recipients === 'string') return recipients;
    
    if (Array.isArray(recipients)) {
        return recipients.map(r => {
            if (r.addressId) {
                const found = addresses.find(a => a.id === r.addressId);
                return found?.name || r.toAddress || '';
            }
            return r.toAddress || '';
        }).join(', ');
    } else if (recipients && typeof recipients === 'object') {
        if (recipients.addressId) {
            const found = addresses.find(a => a.id === recipients.addressId);
            return found?.name || recipients.toAddress || '';
        }
        return recipients.toAddress || '';
    }
    return '';
};

export const calculateAllTransactionAmounts = (transactions: TransactionWithCalculations[]) => {
    return transactions;
};

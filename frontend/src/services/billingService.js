import api from './api';
import { secureId, secureParams, securePayload } from './serviceSecurity';
import { encryptPaymentData } from './encryption';

const billingService = {
  /**
   * Get all payment methods
   * @returns {Promise} API response
   */
  getPaymentMethods: async () => {
    return await api.get('/payment-methods');
  },

  /**
   * Add a new payment method
   * @param {Object} data - Payment method data
   * @returns {Promise} API response
   */
  addPaymentMethod: async (data) => {
    const encrypted = await encryptPaymentData(data);
    return await api.post('/payment-methods', securePayload(encrypted));
  },

  /**
   * Update a payment method
   * @param {number} id - Payment method ID
   * @param {Object} data - Updated data
   * @returns {Promise} API response
   */
  updatePaymentMethod: async (id, data) => {
    const encrypted = await encryptPaymentData(data);
    return await api.patch(`/payment-methods/${secureId(id, 'paymentMethodId')}`, securePayload(encrypted));
  },

  /**
   * Set payment method as default
   * @param {number} id - Payment method ID
   * @returns {Promise} API response
   */
  setDefaultPaymentMethod: async (id) => {
    return await api.patch(`/payment-methods/${secureId(id, 'paymentMethodId')}/set-default`);
  },

  /**
   * Delete a payment method
   * @param {number} id - Payment method ID
   * @returns {Promise} API response
   */
  deletePaymentMethod: async (id) => {
    return await api.delete(`/payment-methods/${secureId(id, 'paymentMethodId')}`);
  },

  /**
   * Get billing summary
   * @returns {Promise} API response
   */
  getBillingSummary: async () => {
    return await api.get('/billing/summary');
  },

  /**
   * Get transaction history
   * @param {number} page - Page number
   * @param {number} perPage - Items per page
   * @returns {Promise} API response
   */
  getTransactions: async (page = 1, perPage = 10) => {
    return await api.get('/billing/transactions', {
      params: secureParams({ page, per_page: perPage })
    });
  },

  /**
   * Get billing address
   * @returns {Promise} API response
   */
  getBillingAddress: async () => {
    return await api.get('/billing/address');
  },

  /**
   * Update billing address
   * @param {Object} data - Address data
   * @returns {Promise} API response
   */
  updateBillingAddress: async (data) => {
    return await api.post('/billing/address', securePayload(data));
  },

  /**
   * Download receipt
   * @param {number} transactionId - Transaction ID
   * @returns {Promise} API response
   */
  downloadReceipt: async (transactionId) => {
    return await api.get(`/billing/transactions/${secureId(transactionId, 'transactionId')}/receipt`);
  },
};

export default billingService;

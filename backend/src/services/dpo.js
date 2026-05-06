// backend/src/services/dpo.js
import axios from 'axios';
import { parseStringPromise, Builder } from 'xml2js';

const API_URL = process.env.DPO_API_URL;
const COMPANY_TOKEN = process.env.DPO_COMPANY_TOKEN;
const SERVICE_TYPE = process.env.DPO_SERVICE_TYPE;

/**
 * Build XML for createToken
 */
function buildCreateTokenXML(orderDetails) {
  const {
    companyRef,
    amount,
    customerEmail,
    customerName,
    redirectURL,
    backURL,
    serviceType = SERVICE_TYPE,
  } = orderDetails;

  const xmlObj = {
    'API3G': {
      CompanyToken: COMPANY_TOKEN,
      Request: 'createToken',
      TransactionType: 'quick',
      TransactionToken: '',
      CompanyRef: companyRef,
      Amount: amount.toFixed(2),
      Currency: 'USD',
      RedirectURL: redirectURL,
      BackURL: backURL,
      customerFirstName: customerName.split(' ')[0] || 'Valued',
      customerLastName: customerName.split(' ')[1] || 'Customer',
      customerEmail,
      customerPhone: '0000000000',
      customerAddress: 'N/A',
      customerCity: 'N/A',
      customerCountry: 'US',
      customerZip: '00000',
      ServiceType: serviceType,
      ServiceDescription: `Order ${companyRef}`,
    }
  };
  const builder = new Builder({ headless: true });
  return builder.buildObject(xmlObj);
}

/**
 * Build XML for verifyToken
 */
function buildVerifyTokenXML(transactionToken, companyRef) {
  const xmlObj = {
    'API3G': {
      CompanyToken: COMPANY_TOKEN,
      Request: 'verifyToken',
      TransactionToken: transactionToken,
      CompanyRef: companyRef,
    }
  };
  const builder = new Builder({ headless: true });
  return builder.buildObject(xmlObj);
}

/**
 * Send XML to DPO API and parse response
 */
async function callDPO(xmlBody) {
  try {
    const response = await axios.post(API_URL, xmlBody, {
      headers: { 'Content-Type': 'application/xml' }
    });
    const result = await parseStringPromise(response.data, { explicitArray: false });
    const api3g = result.API3G;
    if (api3g.Result === '000') {
      return {
        success: true,
        token: api3g.TransactionToken,
        redirectUrl: api3g.PaymentURL,
        raw: api3g
      };
    } else {
      return {
        success: false,
        error: api3g.ResultExplanation || 'Unknown DPO error'
      };
    }
  } catch (err) {
    console.error('DPO API call failed:', err.message);
    return { success: false, error: err.message };
  }
}

export async function createDPOToken(orderDetails) {
  const xml = buildCreateTokenXML(orderDetails);
  return await callDPO(xml);
}

export async function verifyDPOToken(transactionToken, companyRef) {
  const xml = buildVerifyTokenXML(transactionToken, companyRef);
  const result = await callDPO(xml);
  if (result.success && result.raw?.TransactionApproved === 'true') {
    return { verified: true, data: result.raw };
  }
  return { verified: false, error: result.error || 'Payment not approved' };
}
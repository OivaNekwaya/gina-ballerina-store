import axios from 'axios';
import { parseStringPromise, Builder } from 'xml2js';

// Use environment variables – fallback to test values if missing
const API_URL = 'https://secure.3gdirectpay.com/API/v6/';
const COMPANY_TOKEN = '8D3DA73D-9D7F-4E09-96D4-3D44E7A83EA3';
const SERVICE_TYPE = '3854';

console.log('DPO API URL:', API_URL);

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

async function callDPO(xmlBody) {
  try {
    const response = await axios.post(API_URL, xmlBody, {
      headers: { 'Content-Type': 'application/xml' }
    });
    // Log raw response for debugging
    console.log('DPO response status:', response.status);
    console.log('DPO response data:', response.data);
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
        error: api3g.ResultExplanation || 'Unknown DPO error',
        raw: api3g
      };
    }
  } catch (err) {
    console.error('DPO API call failed:', err.message);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response headers:', err.response.headers);
      console.error('Response data:', err.response.data);
    }
    return { success: false, error: err.message };
  }
}

export async function createDPOToken(orderDetails) {
  const xml = buildCreateTokenXML(orderDetails);
  console.log('XML request (first 200 chars):', xml.substring(0, 200));
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
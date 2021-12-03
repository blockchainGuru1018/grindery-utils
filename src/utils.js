import {FORMATS, ORIGINS, VERSIONS} from './constants';

export const parsePaymentType = (data, signed=false) => {
  const {
    recipient, amount, currency, creator, signature='',
    meta=null,
  } = data || {};
  const {origin :metaOrigin=ORIGINS.GRINDERY, version=VERSIONS.ZERO_ZERO_ONE, updateOf=null} = meta || {};

  if(!recipient || !amount || !currency || !creator || (signed && !signature)) {
    throw new Error('recipient, amount, currency, creator and signature are required')
  }

  let optionalFields = {};
  for (const key of ['payer', 'note', 'reference', 'dueDate', 'createdAt']) {
    if(key && data && data[key]) {
      optionalFields[key] = data[key];
    }
  }

  return {
    meta: {
      origin: metaOrigin || origin || ORIGINS.GRINDERY,
      format: FORMATS.PAYMENT_REQUEST,
      version: version || VERSIONS.ZERO_ZERO_ONE,
      ...(updateOf?{updateOf}:{}),
    },
    recipient,
    amount: (amount || '').toString(),
    currency,
    ...optionalFields,
    creator,
    ...(signed?{
      signature
    }:{}),
  };
};
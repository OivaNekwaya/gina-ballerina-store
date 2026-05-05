import Stripe from 'stripe';

let stripeInstance = null;

export function getStripe() {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
}

// For backward compatibility (if other files use `stripe` directly)
export const stripe = new Proxy({}, {
  get(target, prop) {
    return getStripe()[prop];
  }
});
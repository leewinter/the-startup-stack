import Stripe from 'stripe'
import { ERRORS } from '#app/utils/constants/errors'
import { Resource } from 'sst'

if (!Resource.STRIPE_SECRET_KEY.value) {
  throw new Error(`Stripe - ${ERRORS.ENVS_NOT_INITIALIZED})`)
}

export const stripe = new Stripe(Resource.STRIPE_SECRET_KEY.value, {
  apiVersion: '2024-04-10',
  typescript: true,
})

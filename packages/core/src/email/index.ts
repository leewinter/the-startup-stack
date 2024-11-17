import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { Resource } from 'sst'

import { sendAuthEmail } from './templates/auth'
import {
  sendSubscriptionErrorEmail,
  sendSubscriptionSuccessEmail,
} from './templates/subscription'

export type SendEmailOptions = {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export namespace Email {
  export const client = new SESv2Client()

  export const sendSubscriptionSuccess = sendSubscriptionSuccessEmail
  export const sendSubscriptionError = sendSubscriptionErrorEmail
  export const sendAuth = sendAuthEmail

  export const send = async (options: SendEmailOptions) => {
    const from = `test@${Resource.Email.sender}`
    const { subject, to, html } = options

    console.log('sending email', subject, from, to)
    try {
      await client.send(
        new SendEmailCommand({
          FromEmailAddress: from,
          Destination: {
            ToAddresses: Array.isArray(to) ? to : [to],
          },
          Content: {
            Simple: {
              Subject: { Data: subject },
              Body: { Html: { Data: html } },
            },
          },
        }),
      )
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

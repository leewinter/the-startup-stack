import { Resource } from 'sst'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

const client = new SESv2Client()

export type SendEmailOptions = {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: SendEmailOptions) {
  try {
    await client.send(
      new SendEmailCommand({
        FromEmailAddress: `test@${Resource.Email.sender}`,
        Destination: {
          ToAddresses: Array.isArray(options.to) ? options.to : [options.to],
        },
        Content: {
          Simple: {
            Subject: { Data: options.subject },
            Body: { Html: { Data: options.html } },
          },
        },
      }),
    )
  } catch (error) {
    console.error(error)
    throw error
  }
}

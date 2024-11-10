import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Button,
  Preview,
  Text,
  render,
} from '@react-email/components'
import { Email } from '..'

type AuthEmailOptions = {
  email: string
  code: string
  magicLink?: string | null
}

/**
 * Templates.
 */
export function AuthEmail({ code, magicLink }: AuthEmailOptions) {
  return (
    <Html>
      <Head />
      <Preview>Your login code for Remix Auth TOTP</Preview>
      <Body
        style={{
          backgroundColor: '#ffffff',
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
        }}
      >
        <Container style={{ margin: '0 auto', padding: '20px 0 48px' }}>
          <Heading
            style={{
              fontSize: '24px',
              letterSpacing: '-0.5px',
              lineHeight: '1.2',
              fontWeight: '400',
              color: '#484848',
              padding: '12px 0 0',
            }}
          >
            Your login code for The Startup Stack
          </Heading>
          {magicLink && (
            <Section style={{ padding: '8px 0px' }}>
              <Button
                pY={11}
                pX={23}
                style={{
                  display: 'block',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  textAlign: 'center',
                  borderRadius: '3px',
                  backgroundColor: '#5e6ad2',
                }}
                href={magicLink}
              >
                Login
              </Button>
            </Section>
          )}
          <Text style={{ fontSize: '14px', lineHeight: '20px' }}>
            This link and code will only be valid for the next 60 seconds. If the link
            does not work, you can use the login verification code directly:
          </Text>
          <code
            style={{
              padding: '1px 4px',
              color: '#3c4149',
              fontFamily: 'sans-serif',
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '2px',
            }}
          >
            {code}
          </code>
        </Container>
      </Body>
    </Html>
  )
}

/**
 * Renders.
 */
export function renderAuthEmailEmail(args: AuthEmailOptions) {
  return render(<AuthEmail {...args} />)
}

/**
 * Senders.
 */
export async function sendAuthEmail({ email, code, magicLink }: AuthEmailOptions) {
  const html = renderAuthEmailEmail({ email, code, magicLink })

  await Email.send({
    to: email,
    subject: 'Your login code for Remix Auth TOTP',
    html,
  })
}

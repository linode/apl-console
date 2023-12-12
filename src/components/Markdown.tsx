import { Card } from '@mui/material'
import MarkdownJSX from 'markdown-to-jsx'

// Markdown overrides -----------------------------------------------
function Header1({ children }: any) {
  return <h1 style={{ marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #6e768166' }}>{children}</h1>
}
function Header2({ children }: any) {
  return <h2 style={{ marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #6e768166' }}>{children}</h2>
}
function Paragraph({ children }: any) {
  return <p style={{ marginBottom: '16px', lineHeight: '24px' }}>{children}</p>
}
function Code({ children }: any) {
  return <code style={{ borderRadius: '6px', padding: '1.5px 4px', backgroundColor: '#6e768166' }}>{children}</code>
}

// interface and component -----------------------------------------------
interface Props {
  readme: string
  sx?: any
}

export default function Markdown({ readme, sx }: Props) {
  return (
    <Card sx={{ p: '32px', borderRadius: '8px', ...sx }}>
      <MarkdownJSX
        options={{
          overrides: {
            h1: {
              component: Header1,
            },
            h2: {
              component: Header2,
            },
            p: {
              component: Paragraph,
            },
            code: {
              component: Code,
            },
          },
        }}
      >
        {readme}
      </MarkdownJSX>
    </Card>
  )
}

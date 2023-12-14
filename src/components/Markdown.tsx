import { Card, styled } from '@mui/material'
import MarkdownJSX from 'markdown-to-jsx'

// Higher-order component to generate markdown components
const createMDComp = (Tag: any, style: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const StyledTag = styled(Tag)({ ...style })
  return function ({ children }: any) {
    return <StyledTag>{children}</StyledTag>
  }
}

// Markdown overrides -----------------------------------------------
const mb = { marginBottom: '16px' }
const pb = { paddingBottom: '8px' }
const lh = { lineHeight: '24px' }
const border = { border: '1px solid #6e768164' }
const borderBottom = { borderBottom: '1px solid #6e768164' }
const headerStyle = { ...mb, ...pb, ...borderBottom }
const tableCell = { padding: '6px 12px', ...border }

const Header1 = createMDComp('h1', { ...headerStyle })
const Header2 = createMDComp('h2', { ...headerStyle })
const Header3 = createMDComp('h3', { ...mb })
const Paragraph = createMDComp('p', { ...mb, ...lh })
const Code = createMDComp('code', { borderRadius: '6px', padding: '1.5px 4px', backgroundColor: '#6e768164' })
const Pre = createMDComp('pre', {
  ...mb,
  backgroundColor: '#6e768164',
  padding: '12px',
  borderRadius: '6px',
  '& > code': {
    backgroundColor: 'transparent',
  },
})
const Ol = createMDComp('ol', { ...mb, paddingLeft: '32px' })
const Li = createMDComp('li', { ...lh })
const Table = createMDComp('table', { ...mb, borderCollapse: 'collapse' })
const Tbody = createMDComp('tbody', { '& tr:nth-child(even)': { backgroundColor: '#6e768132' } })
const Th = createMDComp('th', { ...tableCell })
const Td = createMDComp('td', { ...tableCell })

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
            h3: {
              component: Header3,
            },
            p: {
              component: Paragraph,
            },
            code: {
              component: Code,
            },
            pre: {
              component: Pre,
            },
            li: {
              component: Li,
            },
            ol: {
              component: Ol,
            },
            table: {
              component: Table,
            },
            tbody: {
              component: Tbody,
            },
            th: {
              component: Th,
            },
            td: {
              component: Td,
            },
          },
        }}
      >
        {readme}
      </MarkdownJSX>
    </Card>
  )
}

import { styled } from '@mui/material/styles'
import * as React from 'react'

import { Link } from './LinkUrl/LinkUrl'
import DocsIcon from '../assets/icons/docs'

export interface DocsLinkProps {
  /** The label to use for analytics purposes */
  analyticsLabel?: string
  /** The URL to link to */
  href: string
  /**
   * The clickable text of the link
   * @default Docs
   * */
  label?: string
  /** A callback function when the link is clicked */
  onClick?: () => void
  /*  */
  icon?: JSX.Element
}

/**
 * - The Docs link breaks the pattern of an external link with the position and size of the icon.
 * - The Docs link is usually featured on create flows in the top right corner of the page, next to the create button.
 * - Consider displaying the title of a key guide or product document as the link instead of the generic “Docs”.
 */
export function DocsLink(props: DocsLinkProps) {
  const { href, label, icon } = props

  return (
    <StyledDocsLink className='docsButton' to={href}>
      {icon ?? <DocsIcon />}
      {label ?? 'Docs'}
    </StyledDocsLink>
  )
}

const StyledDocsLink = styled(Link, {
  label: 'StyledDocsLink',
})(({ theme }) => ({
  '& svg': {
    marginRight: theme.spacing(),
  },
  alignItems: 'center',
  display: 'flex',
  fontFamily: 'sans-serif',
  fontSize: '.875rem',
  lineHeight: 'normal',
  margin: 0,
  minWidth: 'auto',
}))

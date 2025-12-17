import { Theme, styled, useTheme } from '@mui/material/styles'
import { Grid } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import * as React from 'react'

import { Breadcrumb, BreadcrumbProps } from './Breadcrumb/Breadcrumb'
import { Button } from './Button/Button'
import { DocsLink } from './DocsLink'
import { CrumbOverridesProps } from './Breadcrumb/Crumbs'

export interface LandingHeaderProps {
  analyticsLabel?: string
  betaFeedbackLink?: string
  breadcrumbDataAttrs?: { [key: string]: boolean }
  breadcrumbOverrides?: CrumbOverridesProps[]
  breadcrumbProps?: BreadcrumbProps
  buttonDataAttrs?: { [key: string]: boolean | string }
  createButtonText?: string
  disabledBreadcrumbEditButton?: boolean
  disabledCreateButton?: boolean
  docsLabel?: string
  docsLink?: string
  entity?: string
  extraActions?: React.JSX.Element
  loading?: boolean
  onButtonClick?: () => void
  onButtonKeyPress?: (e: React.KeyboardEvent<HTMLButtonElement>) => void
  onDocsClick?: () => void
  removeCrumbX?: number | number[]
  hideCrumbX?: number[]
  shouldHideDocsAndCreateButtons?: boolean
  title?: React.JSX.Element | string
}

/**
 * @note Passing a title prop will override the final `breadcrumbProps` label.
 * If you don't want this behavior, omit a title prop.
 */
export function LandingHeader({
  analyticsLabel,
  betaFeedbackLink,
  breadcrumbDataAttrs,
  breadcrumbOverrides,
  breadcrumbProps,
  buttonDataAttrs,
  createButtonText,
  disabledBreadcrumbEditButton,
  disabledCreateButton,
  docsLabel,
  docsLink,
  entity,
  extraActions,
  loading,
  onButtonClick,
  onButtonKeyPress,
  onDocsClick,
  removeCrumbX,
  hideCrumbX,
  shouldHideDocsAndCreateButtons,
  title,
}: LandingHeaderProps) {
  const theme = useTheme()
  const renderActions = Boolean(onButtonClick || extraActions)
  const labelTitle = title?.toString()

  const xsDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const customXsDownBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down(636))
  const customSmMdBetweenBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.between(636, 'md'))

  const docsAnalyticsLabel = analyticsLabel || `${title} Landing`

  return (
    <Grid alignItems='center' container data-qa-entity-header justifyContent='space-between' sx={{ width: '100%' }}>
      <Grid>
        <Breadcrumb
          data-qa-title
          labelTitle={labelTitle}
          // The pathname set by "breadcrumbProps" is just a fallback to satisfy the type.
          // eslint-disable-next-line no-restricted-globals
          pathname={location.pathname}
          removeCrumbX={removeCrumbX}
          hideCrumbX={hideCrumbX}
          {...breadcrumbDataAttrs}
          {...breadcrumbProps}
          disabledBreadcrumbEditButton={disabledBreadcrumbEditButton}
          crumbOverrides={breadcrumbOverrides}
        />
      </Grid>
      {!shouldHideDocsAndCreateButtons && (
        <Grid>
          <Grid
            sx={{
              flex: '1 1 auto',
              marginLeft: (() => {
                if (customSmMdBetweenBreakpoint) return theme.spacing(2)
                if (customXsDownBreakpoint) return theme.spacing(1)
                return undefined
              })(),
            }}
            alignItems='center'
            display='flex'
            flexWrap={xsDown ? 'wrap' : 'nowrap'}
            gap={3}
            justifyContent='flex-end'
          >
            {docsLink ? (
              <DocsLink analyticsLabel={docsAnalyticsLabel} href={docsLink} label={docsLabel} onClick={onDocsClick} />
            ) : null}
            {renderActions && (
              <Actions>
                {extraActions}
                {onButtonClick ? (
                  <Button
                    buttonType='primary'
                    disabled={disabledCreateButton}
                    loading={loading}
                    onClick={onButtonClick}
                    onKeyPress={onButtonKeyPress}
                    {...buttonDataAttrs}
                  >
                    {createButtonText ?? `Create ${entity}`}
                  </Button>
                ) : null}
              </Actions>
            )}
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}

const Actions = styled('div')(() => ({
  display: 'flex',
  gap: '24px',
  justifyContent: 'flex-end',
}))

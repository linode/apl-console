import { NewFeatureKey, hasSeenNewFeature } from 'utils/newFeaturesCookieManager'
import { Chip } from '@mui/material'

export default function NewFeatureChip({ feature }: { feature: NewFeatureKey }) {
  if (hasSeenNewFeature(feature)) return null

  return (
    <Chip
      label='New'
      size='small'
      sx={{ backgroundColor: 'rgb(114, 89, 214)', fontWeight: 800, color: '#fff', height: '20px', borderRadius: '7px' }}
    />
  )
}

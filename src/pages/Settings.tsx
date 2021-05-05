import React, { useState } from 'react'
import PaperLayout from '../layouts/Paper'
import Settings from '../components/Settings'
import { useApi } from '../hooks/api'

export default (): React.ReactElement => {
  const [formData, loading, err]: any = useApi('getSettings')
  return <PaperLayout comp={<Settings formData={formData} />} />
}

import PaperLayout from 'layouts/Paper'
import React from 'react'
import { useLocation } from 'react-router-dom'

export default function (): React.ReactElement {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  // const iframes = params?.get('iframes')?.split(',')
  const iframes = [
    'https://grafana.51.158.129.24.nip.io/d-solo/iJiti6Lnkgg/kubernetes-cluster-status?orgId=1&refresh=30s&from=1692080796524&to=1692084396524&panelId=35',
    'https://grafana.51.158.129.24.nip.io/d-solo/iJiti6Lnkgg/kubernetes-cluster-status?orgId=1&refresh=30s&from=1692080796524&to=1692084396524&panelId=34',
  ]
  console.log('iframes', iframes)

  const comp = (
    <div>
      <h1>Grafana</h1>
      {iframes ? (
        iframes?.map((item) => (
          <iframe
            title='Grafana iFrame'
            src={item}
            style={{
              width: '100%',
              height: '200px',
              border: 'none',
              marginTop: '10px',
              marginBottom: '10px',
            }}
          />
        ))
      ) : (
        <div>...</div>
      )}
    </div>
  )
  return <PaperLayout comp={comp} />
}

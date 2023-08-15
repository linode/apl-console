import PaperLayout from 'layouts/Paper'
import { getDomain } from 'layouts/Shell'
import React from 'react'

export default function (): React.ReactElement {
  const hostname = window.location.hostname
  const domain = getDomain(hostname)
  const iFrameBaseLink = `https://grafana.${domain}/d-solo/iJiti6Lnkgg/kubernetes-cluster-status?orgId=1&refresh=30s&panelId=`

  const comp = (
    <div>
      <h1>Grafana</h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <iframe
          title='Grafana iFrame'
          src={`${iFrameBaseLink}12`}
          style={{
            width: '50%',
            height: '200px',
            border: 'none',
            marginTop: '10px',
            marginBottom: '10px',
          }}
        />
        <iframe
          title='Grafana iFrame'
          src={`${iFrameBaseLink}13`}
          style={{
            width: '50%',
            height: '200px',
            border: 'none',
            marginTop: '10px',
            marginBottom: '10px',
          }}
        />
      </div>
      <div>
        <iframe
          title='Grafana iFrame'
          src={`${iFrameBaseLink}35`}
          style={{
            width: '100%',
            height: '200px',
            border: 'none',
            marginTop: '10px',
            marginBottom: '10px',
          }}
        />
        <iframe
          title='Grafana iFrame'
          src={`${iFrameBaseLink}34`}
          style={{
            width: '100%',
            height: '200px',
            border: 'none',
            marginTop: '10px',
            marginBottom: '10px',
          }}
        />
      </div>
    </div>
  )
  return <PaperLayout comp={comp} />
}

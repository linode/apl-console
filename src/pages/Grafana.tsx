import PaperLayout from 'layouts/Paper'
import React from 'react'

export default function (): React.ReactElement {
  const origin = window.location.origin
  const [url, setUrl] = React.useState('')
  const [iFrameUrl, setIFrameUrl] = React.useState(origin)

  console.log('origin', origin)

  const comp = (
    <div style={{ height: '80vh' }}>
      <h1>Grafana</h1>
      <input type='text' onChange={(e) => setUrl(e.target.value)} />
      <button type='button' onClick={() => setIFrameUrl(url)}>
        Set URL
      </button>
      <iframe
        title='Grafana iFrame'
        src={iFrameUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  )
  return <PaperLayout comp={comp} />
}

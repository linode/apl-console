import PaperLayout from 'layouts/Paper'
import React from 'react'
import { useLocation } from 'react-router-dom'

export default function (): React.ReactElement {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const iframes = params?.get('iframes')?.split(',')
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

import '@fortawesome/fontawesome-free/css/all.css'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/nunito-sans/400.css'
import '@fontsource/nunito-sans/600.css'
import '@fontsource/nunito-sans/700.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

const root = createRoot(document.getElementById('root'))
root.render(<App />)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register()
serviceWorker.unregister()

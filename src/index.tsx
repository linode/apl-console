import '@fortawesome/fontawesome-free/css/all.css'
import 'i18n/i18n'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'typeface-comfortaa'
import 'typeface-roboto'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register()
serviceWorker.unregister()

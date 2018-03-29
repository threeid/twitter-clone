import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import { init, dispatch } from '@rematch/core'
import * as models from './models'

const store = init({ models })

dispatch.User.restore()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()

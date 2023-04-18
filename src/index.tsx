
import './index.css'
import store from './store'
import {Provider} from 'react-redux'
import {createRoot} from 'react-dom/client'
import {App} from './App'


const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <Provider store={store}>
    <App text={'@reduxjs/toolkit/query/react usage example'} />
    <App text={'duplicate'} />
  </Provider>
)
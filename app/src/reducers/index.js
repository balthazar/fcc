import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import ui from './ui'

export default combineReducers({
  router,
  ui,
})

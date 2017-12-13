import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { StaticRouter } from 'react-router'
import { matchPath } from 'react-router-dom'
import MobileDetect from 'mobile-detect'

import routes from 'routes'
import createStore from 'store'
import page from 'server/page'

import App from 'components/App'

export default stats => async (req, res) => {
  try {
    const md = new MobileDetect(req.headers['user-agent'])
    const isMobile = Boolean(md.mobile() || md.phone() || md.tablet())

    const store = createStore(null, { ui: { isMobile } })
    const sheet = new ServerStyleSheet()

    const context = {}
    const promises = []

    routes.some(route => {
      const match = matchPath(req.url, route)
      if (match && route.load) {
        promises.push(route.load(store))
      }
      return match
    })

    await Promise.all(promises)

    const root = App(store, StaticRouter, { location: req.url, context })
    const html = __DEV__ ? '' : renderToString(sheet.collectStyles(root))
    const styles = __DEV__ ? '' : sheet.getStyleTags()

    res.end(page({ styles, html, state: store.getState(), main: stats.main || 'bundle.js' }))
  } catch (err) {
    res.status(500).send(err.stack)
  }
}

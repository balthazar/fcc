import Evo from 'components/Evo'
import Map from 'components/Map'
import Smith from 'components/Smith'
import Neormalized from 'components/Neormalized'

export default [
  {
    path: '*/evo',
    component: Evo,
  },
  {
    path: '*/map',
    component: Map,
  },
  {
    path: '*/smith',
    component: Smith,
  },
  {
    path: '*/neormalized',
    component: Neormalized,
  },
]

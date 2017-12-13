import { handleActions } from 'redux-actions'

export default handleActions(
  {
    SET_MOBILE: state => ({ ...state, isMobile: true }),
  },
  { isMobile: false },
)

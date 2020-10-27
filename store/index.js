import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
//import mm from 'mm-vuex-module/src'

const store = () => {
  return new Vuex.Store({
    state: state,
    mutations: mutations,
    actions: actions,
    getters: getters
  })
}

export default store

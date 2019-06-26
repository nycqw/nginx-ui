import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        openedNavList: [],
    },

    getters: {
        getOpenedNavList: function (state) {
            return state.openedNavList
        },
    },

    mutations: {
        setOpenedNavList(state, data) {
            state.openedNavList = data;
        },
    },

    actions: {
        commitOpenedNavList: ({commit},openedNavList)=>commit('setOpenedNavList',openedNavList),
    }
})

const state = {
	panicBuyData: {}   //抢购数据
};

const mutations = {
	SET_PANIC_BUY_DATA: (state, data) => {
		state.panicBuyData = {
			...state.panicBuyData,
			...data
		};
		console.log('store------>', state)
	}
};

const actions = {
  	// remove token
	setPanicBuyData({ commit }, data) {
        commit('SET_PANIC_BUY_DATA', data)
	}
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

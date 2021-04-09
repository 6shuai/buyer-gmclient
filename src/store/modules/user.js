import { userLogin, userLogout } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { getAuthMenu } from "@/api/user";

const state = {
	token: getToken(),
	name: "",
	avatar: "",
	loginData: localStorage.loginData ? JSON.parse(localStorage.loginData) : {},
};

const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token;
	},
	SET_LOGIN_DATA: (state, data) => {
		state.loginData = data;
	},
};

const actions = {
	// user login
	login({ commit }, userInfo) {
		return new Promise((resolve, reject) => {
			userLogin(userInfo).then((response) => {
				localStorage.loginData = JSON.stringify(response.obj);
				commit("SET_TOKEN", response.obj.username);
				commit("SET_LOGIN_DATA", response.obj);
				setToken(response.obj.username);
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
		});
	},

  	// user logout
	logout({ commit, state }) {
		return new Promise((resolve, reject) => {
		userLogout()
			.then(() => {
			commit("SET_TOKEN", "");
			localStorage.clear();
			removeToken();
			resolve();
			})
			.catch((error) => {
			reject(error);
			});
		});
	},

  	// remove token
	resetToken({ commit }) {
		return new Promise((resolve) => {
			commit("SET_TOKEN", "");
			removeToken();
			resolve();
		});
	},

	getMenuList({ commit, state }) {
		return new Promise((resolve, reject) => {
			getAuthMenu()
			.then(response => {
			  resolve(response)
			})
			.catch(error => {
			  reject(error)
			})
		})
	  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

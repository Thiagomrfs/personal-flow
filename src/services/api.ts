import axios from "axios";
import store from "../app/store";
import { memoizedRefreshToken } from "./tokens";

export const URL_ACCESS = 'http://localhost:8000'

const api = axios.create({
	baseURL: `${URL_ACCESS}`,
	headers: {
		'Content-Type': 'application/json; charset=utf-8',
		'Accept': 'application/json'
	},
	transformRequest: [(data, headers) => {
		const user = store.getState().user
		
		if (user.access_token) {
			headers['Authorization'] = `Bearer ${user.access_token}`
		}

		if (data instanceof FormData) {
			return data
		} else {
			return JSON.stringify(data);
		}
	}],
})

api.interceptors.response.use((response) => response, (error) => {
	if (error.response.status === 403) {
		alert("Você não tem permissão para executar esta ação.")
	}

	throw error;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const config = error?.config;

		if (error?.response?.status === 401 && !config?.sent) {
			config.sent = true;
			memoizedRefreshToken(config);
		}
		throw error;
	}
);

export default api
import mem from "mem";
import api from "./api";
import store from "../app/store";

import { logout, updateTokens } from '../app/slices/userSlice'

export const useRefreshTokenFn = async (config: any) => {
    const user = store.getState().user

    try {
        api.post("/tokens/refresh/", {
            refresh: user.refresh_token,
        }).then(res => {
            if (res.data?.access) {
                store.dispatch(
                    updateTokens({
                        refresh: user.refresh_token ? user.refresh_token : "",
                        access: res.data.access
                    })
                )

				config.headers = {
					...config.headers,
					Authorization: `Bearer ${res.data?.access}`,
				};

                api.request(config);
			}
        }).catch(err => {
            console.log(err.response.status)
            store.dispatch(logout())
        })
    }
    catch (error) {
        console.log(error)
        store.dispatch(logout())
        alert("sessão expirada!")
        window.location.assign("/")
    }

    return 
};

const maxAge = 10000;

export const memoizedRefreshToken = mem(useRefreshTokenFn, {
    maxAge,
});
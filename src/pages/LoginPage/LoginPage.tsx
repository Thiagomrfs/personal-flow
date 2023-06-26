import "./LoginPage.css"
import { FormEvent, useRef } from "react";

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { parseJwtAccess } from "../../utils/jwt";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../../app/slices/userSlice";
import { toast } from "react-toastify"
import api from "../../services/api";


export const LoginPage = () => {
    const login_ref = useRef<any>()
    const password = useRef<any>()
    const dispatch = useDispatch()
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = (e: FormEvent) => {
        e.preventDefault()

        if (!login_ref.current.value || !password.current.getInput().value) return;

        const postData = {
            username: login_ref.current.value,
            password: password.current.getInput().value
        }

        api.post("tokens/", postData).then(res => {
            let data = parseJwtAccess(res.data.access)
            dispatch(login({
                id: data.user_id,
                access_token: res.data.access,
                refresh_token: res.data.refresh
            }))

            const from = location.state?.from?.pathname

            if (from) navigate(from, { replace: true });
            else navigate("/", { replace: true });

        }).catch(() => {
            toast.error("Por favor verifique suas credenciais", {
                position: "top-right"
            })
            login_ref.current.classList.add("p-invalid")
            password.current.getElement().classList.add("p-invalid")
        })
    }

    return (
        <div id="lg-pg">
            <div className="top">
                <form className="card" onSubmit={handleLogin}>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Login" ref={login_ref}/>
                    </div>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-lock"></i>
                        </span>
                        <Password placeholder="Senha" toggleMask feedback={false} ref={password}/>
                    </div>
                    <Button label="Entrar"/>
                </form>
            </div>
            <div className="bottom">
                <h3>Personal<b>Flow</b></h3>
                <div className="icons">
                    <a className="pi pi-instagram" href="https://www.instagram.com"/>
                    <a className="pi pi-facebook" href="https://www.facebook.com"/>
                </div>
            </div>
        </div>
    )
}
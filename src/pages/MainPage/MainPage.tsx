import { Outlet } from "react-router-dom"
import "./MainPage.css"
import { useDispatch } from "react-redux"
import { logout } from "../../app/slices/userSlice"


export const MainPage = () => {
    const dispatch = useDispatch()
    
    return (
        <div id="m-pg">
            <div id="m-nav">
                <h3>Personal<b>Flow</b></h3>
                <i className="pi pi-sign-out" onClick={() => dispatch(logout())}/>
            </div>
            <div className="m-container">
                <Outlet />
            </div>
        </div>
    )
}
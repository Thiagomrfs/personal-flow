import "./InlineProject.css"
import { Project } from "../ProjectsPage"
import { FC } from "react"
import { useNavigate } from "react-router-dom"

interface props {
    data: Project
}


export const InlineProject : FC<props> = ({ data }) => {
    const navigate = useNavigate()

    return (
        <div className="inline-proj" onClick={() => navigate("projects/" + data.id)}>
            <p><b>{data.nome}</b>: {data.descricao}</p>
        </div>
    )
}
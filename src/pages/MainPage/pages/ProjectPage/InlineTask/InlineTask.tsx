import "./InlineTask.css"
import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { Task } from "../ProjectPage"

interface props {
    data: Task
}

export const InlineTask : FC<props> = ({ data }) => {
    const navigate = useNavigate()

    return (
        <div className="inline-task" onClick={() => navigate("/tasks/" + data.id)}>
            <p><b>{data.titulo}</b>: {data.descricao}</p>
        </div>
    )
}
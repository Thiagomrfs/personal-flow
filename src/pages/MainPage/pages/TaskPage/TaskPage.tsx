import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../../../services/api"
import "./TaskPage.css"
import { toast } from "react-toastify"
import { LeftSide } from "./LeftSide"

import { Divider } from 'primereact/divider';
import { RightSide } from "./RightSide"
        

export type ReducedTask = {
    id: number,
    autor: number,
    data_inicio: string,
    data_fim: string,
    titulo: string,
    descricao: string,
    status: number,
    projeto: number,
    categorias: number[]
}
        
export const TaskPage = () => {
    const { task_pk } = useParams()
    const navigate = useNavigate()
    const client = useQueryClient()

    const { data: task } = useQuery<ReducedTask>(
        ["task", task_pk],
        () => api.get("tasks/" + task_pk).then(res => res.data)
    )

    const deleteTask = useMutation(
        () => toast.promise(
            () => api.delete("tasks/" + task_pk),
            {
                pending: "Deletando...",
                success: "Tarefa deletada com sucesso!",
                error: "Ocorreu um erro na deleção da tarefa!"
            }
        ), {
            onSuccess: () => {
                client.invalidateQueries("project")
                navigate("/projects/" + task?.projeto)
            },
        }
    )

    if (!task) return (
        <div id="tsk-pg">
            <h3>Carregando...</h3>
        </div>
    )

    return (
        <div id="tsk-pg">
            <div className="flex align-items-center gap-2">
                <i className="pi pi-arrow-left" onClick={() => navigate("/projects/" + task?.projeto)}/>
                <h2>{task?.titulo}</h2>
                <i className="pi pi-trash" onClick={() => deleteTask.mutate()}/>
            </div>
            <div className="flex gap-2">
                <LeftSide task_pk={task_pk || ""} data={task} />
                <Divider layout="vertical" />
                <RightSide task_pk={task_pk || ""} />
            </div>
        </div>
    )
}
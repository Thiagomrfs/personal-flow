import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../../../services/api"
import { Project } from "../ProjectsPage/ProjectsPage"
import "./ProjectPage.css"
import { InlineTask } from "./InlineTask/InlineTask"
import { AddTaskModal } from "./AddTaskModal/AddTaskModal"
import { useEffect, useState } from "react"
import { InputText } from "primereact/inputtext"
import { Divider } from 'primereact/divider';
import { toast } from "react-toastify"
import { MultiSelect } from "primereact/multiselect"
import { useSelector } from "react-redux"
import { selectUser } from "../../../../app/slices/userSlice"
        

export type Category = {
    id: number,
    nome: string,
    cor: string
}

export type Status = {
    id: number,
    nome: string
}

export type Task = {
    id: number,
    autor: number,
    data_inicio: string,
    data_fim: string,
    titulo: string,
    descricao: string,
    status: Status,
    projeto: number,
    categorias: Category[]
}


export const ProjectPage = () => {
    const user = useSelector(selectUser)
    const { proj_pk } = useParams()
    const navigate = useNavigate()
    const [details, setDetails] = useState<any>({
        nome: "",
        descricao: "",
        participantes: [],
    })
    const client = useQueryClient()

    const { data: project } = useQuery<Project>(
        ["project", proj_pk],
        () => api.get("projects/" + proj_pk).then(res => res.data)
    )

    const { data: tasks } = useQuery<Task[]>(
        ["tasks", proj_pk],
        () => api.get("projects/" + proj_pk + "/tasks").then(res => res.data)
    )
    const { data: users } = useQuery(
        "users",
        () => api.get("users/").then(res => res.data)
    )

    useEffect(() => {
        if (project) {
            setDetails(project)
        }
    }, [project])

    const updateProject = useMutation(
        () => toast.promise(
            () => api.patch("projects/" + proj_pk, details),
            {
                pending: "Atualizando...",
                success: "Projeto atualizado com sucesso!",
                error: "Ocorreu um erro na atualização do projeto!"
            }
        ), {
            onSuccess: () => {
                client.invalidateQueries("project")
            },
        }
    )

    const deleteProject = useMutation(
        () => toast.promise(
            () => api.delete("projects/" + proj_pk),
            {
                pending: "Deletando...",
                success: "Projeto deletado com sucesso!",
                error: "Ocorreu um erro na deleção do projeto!"
            }
        ), {
            onSuccess: () => {
                client.invalidateQueries("projects")
                navigate("/")
            },
        }
    )

    return (
        <div id="proj-pg">
            <div className="flex align-items-center gap-2">
                <i className="pi pi-arrow-left" onClick={() => navigate("/")}/>
                <h2>{project?.nome}</h2>
                <i className="pi pi-trash" onClick={() => deleteProject.mutate()}/>
            </div>
            <div className="flex align-items-end gap-4">
                <div>
                    <h3>Titulo</h3>
                    <InputText 
                        value={details.nome}
                        onChange={(e) => setDetails((d: any) => ({...d, nome: e.target.value}))} 
                        className="w-full md:w-20rem" 
                        placeholder="Nome"
                    />
                </div>
                <div>
                    <h3>Descrição</h3>
                    <InputText 
                        value={details.descricao}
                        onChange={(e) => setDetails((d: any) => ({...d, descricao: e.target.value}))} 
                        className="w-full md:w-20rem" 
                        placeholder="Descrição"
                    />
                </div>
                {user.id === details.criador &&
                    <div>
                        <h3>Participantes</h3>
                        <MultiSelect 
                            value={details.participantes} 
                            options={users}
                            onChange={(e) => setDetails((d: any) => ({...d, participantes: e.value}))}
                            optionLabel="username"
                            optionValue="id"
                            className="w-full md:w-20rem"
                            placeholder="Participantes"
                        />
                    </div>
                }
                <button className="sv" onClick={() => updateProject.mutate()}>Salvar</button>
            </div>
            <Divider align="left">
                <p>Tarefas</p>
            </Divider>
            {tasks &&
                tasks.map(task => <InlineTask data={task} key={task.id} />)
            }
            <AddTaskModal proj_id={proj_pk || ""}/>
        </div>
    )
}
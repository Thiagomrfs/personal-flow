import { useQuery } from "react-query"
import "./ProjectsPage.css"
import api from "../../../../services/api"
import { InlineProject } from "./InlineProject/InlineProject"
import { useSelector } from "react-redux"
import { selectUser } from "../../../../app/slices/userSlice"
import { AddProjectModal } from "./AddProjectModal/AddProjectModal"

export type Project = {
    id: number,
    nome: string,
    descricao: string,
    participantes: number[],
    autor: number
}

export const ProjectsPage = () => {
    const user = useSelector(selectUser)
    const { data } = useQuery<Project[]>(
        ["projects", user.id],
        () => api.get("projects").then(res => res.data)
    )

    return (
        <div id="pjs-pg">
            <h2>Meus projetos</h2>
            {data &&
                data.map(proj => <InlineProject data={proj} key={proj.id}/>)
            }
            <AddProjectModal />
        </div>
    )
}
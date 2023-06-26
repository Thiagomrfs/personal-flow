import { useMutation, useQuery, useQueryClient } from "react-query"
import { FC, useState } from "react"
import api from "../../../../../services/api"
import { Dialog } from "primereact/dialog"

import "./AddTaskModal.css"
import { toast } from "react-toastify"
import { MultiSelect } from "primereact/multiselect"
import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"
import { Category, Status } from "../ProjectPage"
import { InputText } from "primereact/inputtext"
import { useSelector } from "react-redux"
import { selectUser } from "../../../../../app/slices/userSlice"

export interface ReducedProduct {
    id: string,
    name: string,
    description: string,
    image: string
}

interface state {
    titulo: string,
    descricao: string,
    data_inicio: any,
    data_fim: any,
    categorias: number[],
    status: number
}

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

interface props {
    proj_id: string
}


export const AddTaskModal: FC<props> = ({ proj_id }) => {
    const user = useSelector(selectUser)
    const [visible, setVisible] = useState(false)
    const client = useQueryClient()
    const [details, setDetails] = useState<state>({
        titulo: "",
        descricao: "",
        data_inicio: new Date(),
        data_fim: new Date(),
        categorias: [],
        status: 1
    })

    const { data: categories } = useQuery<Category[]>(
        "categories",
        () => api.get("tasks/categories").then(res => res.data)
    )

    const { data: statuses } = useQuery<Status[]>(
        "statuses",
        () => api.get("tasks/status").then(res => res.data)
    )

    const handleSave = () => {
        let patchData: any = {...details};
        patchData.data_fim = formatDate(patchData.data_fim)
        patchData.data_inicio = formatDate(patchData.data_inicio)
        patchData.autor = user.id
        patchData.projeto = proj_id
        
        createTask.mutate(patchData)
    }

    const createTask = useMutation(
        (data: any) => toast.promise(
            () => api.post("projects/" + proj_id + "/tasks", data),
            {
                pending: "Criando a tarefa...",
                success: "Tarefa atualizada com sucesso!",
                error: "Ocorreu um erro na atualização da tarefa!"
            }
        ), {
            onSuccess: () => {
                client.invalidateQueries(["project", proj_id])
                client.invalidateQueries(["tasks", proj_id])
                setVisible(false)
                setDetails({
                    titulo: "",
                    descricao: "",
                    data_inicio: new Date(),
                    data_fim: new Date(),
                    categorias: [],
                    status: 1
                })
            },
        }
    )

    return (
        <>
            <i className="pi pi-plus add-task-cta" onClick={() => setVisible(true)} />
            {visible &&
                <Dialog
                    header="Adicionar tarefa" visible={visible}
                    className="add-task-md" onHide={() => setVisible(false)}
                    maximizable blockScroll draggable={false}
                >
                    <div className="flex gap-4">
                        <div>
                            <h3>Titulo</h3>
                            <InputText
                                value={details.titulo}
                                onChange={(e) => setDetails(d => ({ ...d, titulo: e.target.value }))}
                                className="w-full md:w-20rem"
                                placeholder="Título"
                            />
                        </div>
                        <div>
                            <h3>Descrição</h3>
                            <InputText
                                value={details.descricao}
                                onChange={(e) => setDetails(d => ({ ...d, descricao: e.target.value }))}
                                className="w-full md:w-20rem"
                                placeholder="Descrição"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <h3>Data de início</h3>
                            <Calendar
                                value={details.data_inicio}
                                className="w-full md:w-20rem"
                                placeholder="data de início"
                                onChange={(e) => setDetails(d => ({ ...d, data_inicio: e.value }))}
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                        <div>
                            <h3>Data de finalização</h3>
                            <Calendar
                                value={details.data_fim}
                                className="w-full md:w-20rem"
                                placeholder="data de finalização"
                                onChange={(e) => setDetails(d => ({ ...d, data_fim: e.value }))}
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <h3>Categorias</h3>
                            <MultiSelect
                                value={details.categorias}
                                options={categories}
                                onChange={(e) => setDetails(d => ({ ...d, categorias: e.value }))}
                                optionLabel="nome"
                                optionValue="id"
                                className="w-full md:w-20rem"
                                placeholder="categorias"
                            />
                        </div>
                        <div>
                            <h3>Status</h3>
                            <Dropdown
                                value={details.status}
                                options={statuses}
                                optionLabel="nome"
                                optionValue="id"
                                className="w-full md:w-20rem"
                                onChange={(e) => setDetails(d => ({ ...d, status: e.value }))}
                                placeholder="status"
                            />
                        </div>
                    </div>
                    <button className="sv" onClick={handleSave}>Salvar</button>
                </Dialog>
            }
        </>
    )
}
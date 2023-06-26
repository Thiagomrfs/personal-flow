import api from "../../../../services/api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Category, Status } from "../ProjectPage/ProjectPage";
import { toast } from "react-toastify";
import { InputText } from "primereact/inputtext"
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { FC, useState } from "react"

interface props {
    data: any,
    task_pk: string
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

function deserializeDate(dateString: string) {
    const parts = dateString.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    return date
}

export const LeftSide: FC<props> = ({ data, task_pk }) => {
    const [details, setDetails] = useState<state>({
        titulo: data.titulo,
        descricao: data.descricao,
        data_inicio: deserializeDate(data.data_inicio),
        data_fim: deserializeDate(data.data_fim),
        categorias: data.categorias,
        status: data.status
    })
    const client = useQueryClient()

    const { data: categories } = useQuery<Category[]>(
        "categories",
        () => api.get("tasks/categories").then(res => res.data)
    )

    const { data: statuses } = useQuery<Status[]>(
        "statuses",
        () => api.get("tasks/status").then(res => res.data)
    )

    const updateTask = useMutation(
        (data: any) => toast.promise(
            () => api.patch("tasks/" + task_pk, data),
            {
                pending: "Atualizando...",
                success: "Tarefa atualizada com sucesso!",
                error: "Ocorreu um erro na atualização da tarefa!"
            }
        ), {
            onSuccess: () => {
                client.invalidateQueries(["task", task_pk])
                client.invalidateQueries("project")
            },
        }
    )

    const handleSave = () => {
        let patchData = {...details};
        patchData.data_fim = formatDate(patchData.data_fim)
        patchData.data_inicio = formatDate(patchData.data_inicio)
        
        updateTask.mutate(patchData)
    }


    return (
        <div>
        <div className="flex gap-4">
                <div>
                    <h3>Titulo</h3>
                    <InputText 
                        value={details.titulo}
                        onChange={(e) => setDetails(d => ({...d, titulo: e.target.value}))} 
                        className="w-full md:w-20rem" 
                        placeholder="Título"
                    />
                </div>
                <div>
                    <h3>Descrição</h3>
                    <InputText 
                        value={details.descricao}
                        onChange={(e) => setDetails(d => ({...d, descricao: e.target.value}))} 
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
                        onChange={(e) => setDetails(d => ({...d, data_inicio: e.value}))} 
                        dateFormat="dd/mm/yy"
                    />
                </div>
                <div>
                    <h3>Data de finalização</h3>
                    <Calendar 
                        value={details.data_fim}
                        className="w-full md:w-20rem" 
                        placeholder="data de finalização"
                        onChange={(e) => setDetails(d => ({...d, data_fim: e.value}))} 
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
                        onChange={(e) => setDetails(d => ({...d, categorias: e.value}))}
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
                        onChange={(e) => setDetails(d => ({...d, status: e.value}))}
                        placeholder="status"
                    />
                </div>
            </div>
            <button className="sv" onClick={handleSave}>Salvar</button>
        </div>
    )
}
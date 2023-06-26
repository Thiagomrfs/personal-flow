import { useMutation, useQueryClient } from "react-query"
import { useState } from "react"
import api from "../../../../../services/api"
import { Dialog } from "primereact/dialog"

import "./AddProjectModal.css"
import { toast } from "react-toastify"
import { InputText } from "primereact/inputtext"


export const AddProjectModal = () => {
    const [visible, setVisible] = useState(false)
    const client = useQueryClient()
    const [details, setDetails] = useState({
        nome: "",
        descricao: "",
    })

    const handleSave = () => {
        let patchData: any = {...details};
        createProject.mutate(patchData)
    }

    const createProject = useMutation(
        (data: any) => toast.promise(
            () => api.post("projects/", data),
            {
                pending: "Criando o projeto...",
                success: "Projeto criado com sucesso!",
                error: "Ocorreu um erro na criação do projeto!"
            }
        ), {
            onSuccess: () => {
                client.invalidateQueries("projects")
                setVisible(false)
                setDetails({
                    nome: "",
                    descricao: "",
                })
            },
        }
    )

    return (
        <>
            <i className="pi pi-plus add-proj-cta" onClick={() => setVisible(true)} />
            {visible &&
                <Dialog
                    header="Adicionar tarefa" visible={visible}
                    className="add-proj-md" onHide={() => setVisible(false)}
                    maximizable blockScroll draggable={false}
                >
                    <div className="flex gap-4">
                        <div>
                            <h3>Titulo</h3>
                            <InputText
                                value={details.nome}
                                onChange={(e) => setDetails(d => ({ ...d, nome: e.target.value }))}
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
                    <button className="sv" onClick={handleSave}>Salvar</button>
                </Dialog>
            }
        </>
    )
}
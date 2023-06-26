import api from "../../../../services/api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { InputText } from "primereact/inputtext"
import { FC, useState } from "react"
import { InlineComment } from "./InlineComment";

interface props {
    task_pk: string
}

export const RightSide: FC<props> = ({ task_pk }) => {
    const [text, setText] = useState("")
    const client = useQueryClient()

    const { data } = useQuery(
        ["comments", task_pk],
        () => api.get("tasks/" + task_pk + "/comments").then(res => res.data)
    )

    const postComment = useMutation(
        () => toast.promise(
            () => api.post("tasks/" + task_pk + "/comments", {texto: text}),
            {
                pending: "Postando comentário...",
                success: "Comentário postado com sucesso!",
                error: "Ocorreu um erro na postagem do comentário!"
            }
        ), {
            onSuccess: () => {
                client.invalidateQueries(["comments", task_pk])
                setText("")
            },
        }
    )

    const handleSave = () => {
        if (text === "") return; 

        postComment.mutate()
    }

    return (
        <div className="r-side">
            <h3>Comentários</h3>
            <div className="flex gap-2 align-items-center">
                <InputText value={text} onChange={(e) => setText(e.target.value)} className="w-full"/>
                <i className="pi pi-send" onClick={handleSave}/>
            </div>
            <div className="com-ct">
                {data &&
                    data.map((com: any) => <InlineComment data={com} key={com.texto}/>)
                }
            </div>
        </div>
    )
}
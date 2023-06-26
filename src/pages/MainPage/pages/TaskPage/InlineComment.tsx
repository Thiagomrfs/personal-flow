import { FC } from "react"
import { Divider } from 'primereact/divider';


interface props {
    data: {
        texto: string,
        autor: string
    }
}

export const InlineComment: FC<props> = ({ data }) => {
    return (
        <div className="inline-comment">
            <Divider align="left">
                <p>{data.autor}</p>
            </Divider>
            <p>{data.texto}</p>
        </div>
    )
}
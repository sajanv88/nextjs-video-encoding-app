import styles from '../styles/Home.module.css'
import Header from "../components/Header/Header";
import {FormEvent, SyntheticEvent, useState} from "react";
import {NextPageContext} from "next";
import {CodecConfiguration, PaginationResponse} from "@bitmovin/api-sdk";

interface HomeProps {
    configuration: PaginationResponse<CodecConfiguration>;
}
export default function Home({configuration}: HomeProps) {
    console.log(configuration, '===');
    const [file, setFile] = useState<File | undefined>(undefined);
    const onChangeEvent = (e: SyntheticEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        if(target.files) {
            setFile(target.files[0]);
        }
    }
    const onSubmitEvent = async (e: FormEvent) => {
        e.preventDefault();
        const fd = new FormData()
        fd.append('file', file as File);
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: fd
        })
        const data = await response.json();
        console.log(data, '--');
    }
  return (
    <div className={styles.container}>
      <Header/>

      <main className={styles.main}>

            <div className={styles.uploader}>
                <form onSubmit={onSubmitEvent}>
                    <input type="file" name="file" onChange={onChangeEvent}/>
                    <button type="submit" disabled={!file}>Upload</button>
                </form>
            </div>

            <div className={styles.configurations}>

            </div>

      </main>
    </div>
  )
}

Home.getInitialProps = async (ctx: NextPageContext) => {
    const res = await fetch('http://localhost:3000/api/configurations');
    const configuration = await res.json() as PaginationResponse<CodecConfiguration>;
    return {configuration};
}

import {CodecConfiguration, PaginationResponse} from "@bitmovin/api-sdk";
import {useMemo, FormEvent} from "react";

interface Config extends CodecConfiguration {
    type: string;
}
interface ConfigurationProps {
    items: Config[];
}
export default function Configuration({items}: ConfigurationProps) {
    const audioCodec = useMemo<Config[]>(() => items.filter(c => c.type === 'AAC'), [items]);
    const videoCodec = useMemo<Config[]>(() => items.filter(c => c.type !== 'AAC'), [items]);
    const onSubmitEvent = (e: FormEvent) => {
        e.preventDefault()
        const target = e.target as HTMLFormElement;
        const form = new FormData(target);
        console.log(form.toString());
    }
    return (
        <div className='configuration'>
            <div>
                <h2>Video Codec</h2>
                <form onSubmit={onSubmitEvent}>
                    {videoCodec.map(v => (
                        <div key={v.id}>
                            <input type="radio" defaultValue={v.type} name="vcodec" id="vcodec" />
                            <label htmlFor="vcodec">{v.name}</label>
                        </div>
                    ))}
                </form>
            </div>
            <div>
                <h2>Audio Codec</h2>
                <form onSubmit={onSubmitEvent}>
                    {audioCodec.map(a => (
                        <div key={a.id}>
                            <input type="radio" defaultValue={a.type} name="acodec" id="acodec" />
                            <label htmlFor="acodec">{a.name}</label>
                        </div>
                    ))}
                </form>
            </div>

        </div>
    )
}
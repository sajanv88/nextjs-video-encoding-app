import BitmovinApi, {ConsoleLogger, S3Input, S3Output} from "@bitmovin/api-sdk";
import Storage from './aws';
class BitMovin {
    #apiInstance: BitmovinApi;

    constructor() {
        this.#apiInstance = new BitmovinApi({
            apiKey: process.env.BITMOVIN_API_KEY!,
            logger: new ConsoleLogger()
        });
    }

    createEncoding = async (name: string): Promise<{inputId: string, outputId: string}> => {
        const inputs = new S3Input({
            name: `${name}-input`,
            ...Storage.getInfo(),
        })
        const outputs = new S3Output({
            name: `${name}-output`,
            ...Storage.getInfo()
        })
        const input = await this.#apiInstance.encoding.inputs.s3.create(inputs);
        const output = await this.#apiInstance.encoding.outputs.s3.create(outputs);
        return {
            inputId: input.id as string,
            outputId: output.id as string,
        }
    }

    getEncoding = async (options: {type: 'inputs' | 'outputs', id: string}): Promise<S3Input | S3Output> => {
        const type = options.type;
        return await this.#apiInstance.encoding[type].s3.get(options.id);
    }

    codes = async () => {
        const configurations = await this.#apiInstance.encoding.configurations.list();
        return configurations;
    }

}

export default new BitMovin();
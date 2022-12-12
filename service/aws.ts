import S3, {ListObjectsV2Output, ManagedUpload} from 'aws-sdk/clients/s3';
import {NextApiResponse} from "next";
import fs from 'fs';



class Storage {
    #storage: S3 | undefined = undefined;


    constructor() {
        this.#init()
    }

    #bucketName = (): {Bucket: string} => ({Bucket: process.env.AWS_BUCKET_NAME!})
    #init = async () => {
        const s = await new S3({credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY!,
                secretAccessKey: process.env.AWS_SECRET_KEY!
        }});
        this.#storage = s;
    }

    uploadObject = async (object:Express.Multer.File): Promise<ManagedUpload.SendData | undefined> => {
        const bucket = this.#bucketName();
        const blob = fs.readFileSync(object.path);
        const uploadedObject = await this.#storage?.upload({
            ...bucket,
            Key: object.originalname,
            Body: blob
        });
        return uploadedObject?.promise();
    }

    getObjects = async (res:NextApiResponse):Promise<void> => {
        const bucket = this.#bucketName();
        await this.#storage?.listObjectsV2(bucket, async function(err, data) {
            if(err) {
                return res.status(500).json({error: err.message, name: err.name});
            }
            res.status(200).json({data})
        })
    }
}



export default new Storage();

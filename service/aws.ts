import S3, {GetObjectOutput, ListObjectsV2Output, ManagedUpload} from 'aws-sdk/clients/s3';
import {NextApiResponse} from "next";
import fs from 'fs';
import {AWSError} from "aws-sdk";



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
        await this.#storage?.listObjectsV2(bucket, async (err, data) => {
            if(err) {
                return res.status(500).json({error: err.message, name: err.name});
            }
            res.status(200).json({data})
        })
    }

    getObject = async (key: string, done: (err: AWSError | null, data: GetObjectOutput | null) => void):Promise<void> => {
        const bucket = this.#bucketName();
        await this.#storage?.getObject({...bucket, Key: key}, (err, data) => {
            if(err) return done(err, null);
            done(null, data);
        })
    }

    getInfo = () => {
        return {
            bucketName: this.#bucketName().Bucket,
            accessKey: process.env.AWS_ACCESS_KEY!,
            secretKey: process.env.AWS_SECRET_KEY!
        }
    }
}



export default new Storage();

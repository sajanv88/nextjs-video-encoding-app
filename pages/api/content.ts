import {NextApiRequest, NextApiResponse} from "next";
import Storage from '../../service/aws';
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if(req.query.key) {
        return await Storage.getObject(req.query.key as string, (err, data) => {
            if(err) return res.status(404).json({status: err.cause});
            return res.status(200).json({status: 'success', info: data});
        })
    }
    return await Storage.getObjects(res);
}
import {NextApiRequest, NextApiResponse} from "next";
import Bitmovin from "../../service/bitmovin";
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const configurations = await Bitmovin.codes();
    res.status(200).json({status: 'success', info: configurations});
}
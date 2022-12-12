// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import {ListObjectsV2Output} from 'aws-sdk/clients/s3';
import Storage from '../../service/aws';
import multer from 'multer';
import nextConnect from 'next-connect';
import fs from 'fs/promises'

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename(req, file, cb) {
      cb(null, `${file.originalname}`)
    }
  })
});

export interface UploadRequest extends NextApiRequest {
  file: Express.Multer.File;
}
type Data = {
  name?: string
  error?: string;
  data?: ListObjectsV2Output;
}

const route = nextConnect({
  onError(error, req:NextApiRequest, res:NextApiResponse) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
});
const uploadMiddleware = upload.single('file');
route.use(uploadMiddleware);
route.post(async(req: UploadRequest, res:NextApiResponse) => {
  const uploaded = await Storage.uploadObject(req.file);
  await fs.unlink(req.file.path);
  res.status(200).json({ data: {status:'success', info: uploaded} });

})
export default route;

export const config = {
  api: {
    bodyParser: false,
  }
}
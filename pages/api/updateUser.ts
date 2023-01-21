// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { UserDetails } from '../../types/typings';
import db from '../../lib/firebase';
import { setDoc, doc } from 'firebase/firestore';

type Data = {
  error?: string;
  success: boolean;
};

interface ExtendedNextApiRequest extends NextApiRequest {
  body: UserDetails;
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  const { email, fname, image, lname, username } = req.body;

  if (!email || !fname || !lname || !image || !username) {
    res.status(400).send({ success: false, error: 'Incorrect data provided' });
  }

  try {
    await setDoc(doc(db, 'users', email), req.body);
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: 'Sorry, Some error occured at our side!',
    });
  }
}

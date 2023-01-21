// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { SessionDetails } from '../../types/typings';
import db from '../../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';

type Data = {
  error?: string;
  success: boolean;
  slug?: string;
};

interface ExtendedNextApiRequest extends NextApiRequest {
  body: SessionDetails;
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    title,
    subtitle,
    startDate,
    startTime,
    speaker,
    categories,
    description,
    duration,
    mainImage,
    technologies,
  } = req.body;

  if (
    !title ||
    !subtitle ||
    !startDate ||
    !startTime ||
    !speaker ||
    !categories ||
    !description ||
    !duration ||
    !mainImage ||
    !technologies
  ) {
    res.status(400).send({ success: false, error: 'Incorrect data provided' });
  }

  try {
    const docRef = await addDoc(collection(db, 'sessions'), {
      ...req.body,
      status: 'upcoming',
    });
    res.status(200).send({ success: true, slug: docRef.id });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: 'Sorry, Some error occured at our side!',
    });
  }
}

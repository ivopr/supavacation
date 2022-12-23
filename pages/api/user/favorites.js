import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  // TODO: Check if user is authenticated
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  // TODO: Add home to favorite
  if (req.method === 'GET') {
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
      include: {
        favoritedHomes: true,
      }
    });

    return res.status(200).json(user.favoritedHomes)
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['GET']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
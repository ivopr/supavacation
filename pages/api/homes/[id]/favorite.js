import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  // Check if user is authenticated
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }
  
  // Retrieve home ID from request
  const { id } = req.query;

  // Add home to favorite
  if (req.method === 'PUT') {
    const home = await prisma.home.update({
      where: { id },
      data: {
        favoritedBy: {
          connect: {
            email: session.user.email
          }
        }
      }
    });

    return res.status(200).json(home);
  }
  // Remove home from favorite
  else if (req.method === 'DELETE') {
    const home = await prisma.home.update({
      where: { id },
      data: {
        favoritedBy: {
          disconnect: {
            email: session.user.email
          }
        }
      }
    });
    
    return res.status(200).json(home);
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import { Grid } from '@/components/Grid';
import { prisma } from '@/lib/prisma';

export async function getServerSideProps(context) {
  const { user } = await getSession(context);

  if (user) {
    // Get all homes
    const homes = (await prisma.user.findFirst({
      where: {
        email: user.email,
      },
      include: {
        favoritedHomes: true
      }
    })).favoritedHomes;
  
    // Pass the data to the Home page
    return {
      props: {
        homes: JSON.parse(JSON.stringify(homes)),
      },
    };
  }
}

export default function Favorites({ homes = [] }) {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">Your listings</h1>
      <p className="text-gray-500">
        Manage your homes and update your listings
      </p>
      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </Layout>
  );
};
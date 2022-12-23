import Card from '@/components/Card';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export const Grid = ({ homes = [] }) => {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);
  const isEmpty = !homes || homes.length === 0;

  const getUserFavoriteHomes = useCallback(async () => {
    try {
      if (session?.user) {
        const { data: favoriteHomes } = await axios.get("/api/user/favorites");

        setFavorites(favoriteHomes);
      }
    } catch (e) {
      console.log(e)
    }
  }, [session?.user]);

  useEffect(() => {
    getUserFavoriteHomes()
  }, [getUserFavoriteHomes]);

  const toggleFavorite = async id => {
    try {
      if (session.user) {
        if (!!favorites.find(f => f.id === id)) {
          await axios.delete(`/api/homes/${id}/favorite`)
        } else {
          await axios.put(`/api/homes/${id}/favorite`)
        }
        getUserFavoriteHomes();
      }
    } catch (e) {
      console.log(e)
    }
  };

  return isEmpty ? (
    <p className="text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1">
      <ExclamationCircleIcon className="shrink-0 w-5 h-5 mt-px" />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {homes.map(home => (
        <Card
          key={home.id}
          {...home}
          onClickFavorite={toggleFavorite}
          favorite={!!favorites.find(f => f.id === home.id)}
        />
      ))}
    </div>
  );
};

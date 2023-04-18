import { useEffect, useState } from 'react';

import GameCard from '../GameCard';

import styles from './GameList.module.scss';

type GameProp = {
  appid: string;
  name: string;
  img_icon_url: string;
  playtime_forever: number;
  playtime_2weeks?: number;
};

function GameList() {
  const [games, setGames] = useState<GameProp[]>([]);

  useEffect(() => {
    fetch(
      `/api/IPlayerService/GetOwnedGames/v0001/?key=${import.meta.env.VITE_STEAM_KEY}&steamid=${
        import.meta.env.VITE_STEAM_ID
      }&include_appinfo=true`
    )
      .then((res) => res.json())
      .then(({ response }) => setGames(response.games));
  }, []);

  if (games.length === 0) {
    return null;
  }

  const sortedGames = [...games].sort(
    (prev, next) => next.playtime_forever - prev.playtime_forever
  );
  return (
    <div className={styles.wrapper}>
      {sortedGames.map((game) => (
        <GameCard
          key={game.appid}
          gameId={game.appid}
          imageUrl={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
          name={game.name}
          totalPlayTime={game.playtime_forever}
          twoWeeksPlayTime={game.playtime_2weeks}
        />
      ))}
    </div>
  );
}

export default GameList;

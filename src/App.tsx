import { useEffect, useState } from 'react';

import GameList from './components/GameList';
import ListHeader from './components/ListHeader';

import './App.css';

export type GameProp = {
  appid: string;
  name: string;
  img_icon_url: string;
  playtime_forever: number;
  playtime_2weeks: number;
};

function App() {
  const [games, setGames] = useState<GameProp[]>([]);

  useEffect(() => {
    fetch(
      `/api/IPlayerService/GetOwnedGames/v0001/?key=${import.meta.env.VITE_STEAM_KEY}&steamid=${
        import.meta.env.VITE_STEAM_ID
      }&include_appinfo=true`
    )
      .then((res) => res.json())
      .then(({ response }) =>
        setGames(
          response.games.map((game: GameProp) => ({
            ...game,
            playtime_2weeks: game.playtime_2weeks ? game.playtime_2weeks : 0,
          }))
        )
      );
  }, []);

  const handleSortGamesWithTotalPlayTime = () => {
    const nextGames = [...games].sort(
      (prev, next) => next.playtime_forever - prev.playtime_forever
    );
    setGames(nextGames);
  };

  const handleSortGamesWith2WeeksPlayTime = () => {
    const nextGames = [...games].sort((prev, next) => next.playtime_2weeks - prev.playtime_2weeks);
    setGames(nextGames);
  };

  return (
    <div className="App">
      <ListHeader
        sortGamesWithTotalPlayTime={handleSortGamesWithTotalPlayTime}
        sortGamesWith2WeeksPlayTime={handleSortGamesWith2WeeksPlayTime}
      />
      <GameList games={games} />
    </div>
  );
}

export default App;

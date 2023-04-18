import { useEffect, useState } from 'react';

import GameList from './components/GameList';
import ListHeader from './components/ListHeader';

import type { GameCardProps } from './components/GameCard';

import './App.css';

export type GameProp = {
  appid: string;
  name: string;
  img_icon_url: string;
  playtime_forever: number;
  playtime_2weeks: number;
};

function App() {
  const [games, setGames] = useState<GameCardProps[]>([]);

  useEffect(() => {
    fetch(
      `/api/IPlayerService/GetOwnedGames/v0001/?key=${import.meta.env.VITE_STEAM_KEY}&steamid=${
        import.meta.env.VITE_STEAM_ID
      }&include_appinfo=true`
    )
      .then((res) => res.json())
      .then(async ({ response }) => {
        const nextGames: GameCardProps[] = [];

        for (let game of response.games as GameProp[]) {
          const res = await fetch(
            `/api/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${game.appid}&key=${
              import.meta.env.VITE_STEAM_KEY
            }&steamid=${import.meta.env.VITE_STEAM_ID}`
          );

          const updatedGame: GameCardProps = {
            imageHash: game.img_icon_url,
            name: game.name,
            gameId: game.appid,
            totalPlayTime: game.playtime_forever,
            twoWeeksPlayTime: game.playtime_2weeks || 0,
            totalAchievements: 0,
            unlockedAchievements: 0,
          };

          if (res.status === 200) {
            const data = await res.json();
            const { playerstats: playerStats } = data;
            const unlockedAchievements = playerStats.achievements.filter(
              (achievement: { unlocktime: number }) => achievement.unlocktime > 0
            );

            nextGames.push({
              ...updatedGame,
              totalAchievements: playerStats.achievements.length,
              unlockedAchievements: unlockedAchievements.length,
            });
          } else {
            nextGames.push({
              ...updatedGame,
            });
          }
        }

        setGames(nextGames);
      });
  }, []);

  const handleSortGamesWithTotalPlayTime = () => {
    const nextGames = [...games].sort((prev, next) => next.totalPlayTime - prev.totalPlayTime);
    setGames(nextGames);
  };

  const handleSortGamesWith2WeeksPlayTime = () => {
    const nextGames = [...games].sort(
      (prev, next) => next.twoWeeksPlayTime - prev.twoWeeksPlayTime
    );
    setGames(nextGames);
  };

  const handleSortGamesWithUnlockedAchievements = () => {
    const nextGames = [...games].sort(
      (prev, next) => next.unlockedAchievements - prev.unlockedAchievements
    );
    setGames(nextGames);
  };

  return (
    <div className="App">
      <ListHeader
        sortGamesWithTotalPlayTime={handleSortGamesWithTotalPlayTime}
        sortGamesWith2WeeksPlayTime={handleSortGamesWith2WeeksPlayTime}
        sortGamesWithUnlockedAchievements={handleSortGamesWithUnlockedAchievements}
      />
      <GameList games={games} />
    </div>
  );
}

export default App;

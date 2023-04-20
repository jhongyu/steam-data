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
    const { DEV: isDev, VITE_STEAM_KEY, VITE_STEAM_ID } = import.meta.env;
    const prefixUrl = isDev ? '/api' : 'https://api.steampowered.com';

    fetch(
      `${prefixUrl}/IPlayerService/GetOwnedGames/v0001/?key=${VITE_STEAM_KEY}&steamid=${VITE_STEAM_ID}&include_appinfo=true`
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then(({ response }) => {
        const resGames = response.games as GameProp[];
        const gamesObj = {} as {
          [key: string]: GameCardProps;
        };

        setGames(
          resGames.map((game) => ({
            imageHash: game.img_icon_url,
            name: game.name,
            gameId: game.appid,
            totalPlayTime: game.playtime_forever,
            twoWeeksPlayTime: game.playtime_2weeks || 0,
            totalAchievements: 0,
            unlockedAchievements: 0,
          }))
        );

        resGames.forEach((game) => {
          gamesObj[game.name] = {
            imageHash: game.img_icon_url,
            name: game.name,
            gameId: game.appid,
            totalPlayTime: game.playtime_forever,
            twoWeeksPlayTime: game.playtime_2weeks || 0,
            totalAchievements: 0,
            unlockedAchievements: 0,
          };
        });

        Promise.all(
          resGames.map((game) =>
            fetch(
              `${prefixUrl}/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${game.appid}&key=${VITE_STEAM_KEY}&steamid=${VITE_STEAM_ID}`
            )
          )
        )
          .then((responses) =>
            Promise.all(
              responses.map((res) => {
                if (res.status === 200) {
                  return res.json();
                }
              })
            )
          )
          .then((data) => {
            const filteredData = data.filter((item) => !!item);
            const achievementsObj = {} as {
              [key: string]: {
                total: number;
                unlocked: number;
              };
            };

            filteredData.forEach(({ playerstats: playerStats }) => {
              const { gameName, achievements } = playerStats;
              const unlockedAchievements = achievements.filter(
                (achievement: { achieved: boolean }) => achievement.achieved
              );

              achievementsObj[gameName] = {
                total: achievements.length,
                unlocked: unlockedAchievements.length,
              };
            });

            setGames((prev) =>
              prev.map((game) => {
                if (achievementsObj[game.name]) {
                  return {
                    ...game,
                    totalAchievements: achievementsObj[game.name].total,
                    unlockedAchievements: achievementsObj[game.name].unlocked,
                  };
                } else {
                  return game;
                }
              })
            );
          });
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

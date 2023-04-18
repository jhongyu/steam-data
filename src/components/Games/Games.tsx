import { useEffect, useState } from 'react';

import GameList from '../GameList';
import ListHeader from '../ListHeader';
import { GameCardProps } from '../GameCard';

function Games() {
  const [games, setGames] = useState<GameCardProps[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/games');
      const data: GameCardProps[] = await response.json();

      setGames(data);
    })();
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
    <>
      <ListHeader
        sortGamesWithTotalPlayTime={handleSortGamesWithTotalPlayTime}
        sortGamesWith2WeeksPlayTime={handleSortGamesWith2WeeksPlayTime}
        sortGamesWithUnlockedAchievements={handleSortGamesWithUnlockedAchievements}
      />
      <GameList games={games} />
    </>
  );
}

export default Games;

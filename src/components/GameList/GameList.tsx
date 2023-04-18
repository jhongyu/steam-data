import GameCard from '../GameCard';

import type { GameCardProps } from '../GameCard';

import styles from './GameList.module.scss';

type GameListProps = {
  games: GameCardProps[];
};

function GameList({ games }: GameListProps) {
  if (games.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {games.map((game) => (
        <GameCard
          key={game.gameId}
          gameId={game.gameId}
          imageHash={game.imageHash}
          name={game.name}
          totalPlayTime={game.totalPlayTime}
          twoWeeksPlayTime={game.twoWeeksPlayTime}
          totalAchievements={game.totalAchievements}
          unlockedAchievements={game.unlockedAchievements}
        />
      ))}
    </div>
  );
}

export default GameList;

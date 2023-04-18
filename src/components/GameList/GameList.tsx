import GameCard from '../GameCard';
import type { GameProp } from '../../App';

import styles from './GameList.module.scss';

type GameListProps = {
  games: GameProp[];
};

function GameList({ games }: GameListProps) {
  if (games.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {games.map((game) => (
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

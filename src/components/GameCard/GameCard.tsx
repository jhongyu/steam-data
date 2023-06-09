import Image from 'next/image';

import styles from './GameCard.module.scss';

export type GameCardProps = {
  imageHash: string;
  name: string;
  gameId: string;
  totalPlayTime: number;
  twoWeeksPlayTime: number;
  totalAchievements: number;
  unlockedAchievements: number;
};

function formatTime(minutes: number) {
  return minutes > 0 ? (minutes / 60).toFixed(1) : 0;
}

function GameCard({
  name,
  gameId,
  totalPlayTime,
  twoWeeksPlayTime,
  totalAchievements,
  unlockedAchievements,
}: GameCardProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.imageWrapper}>
        <Image
          src={`https://cdn.akamai.steamstatic.com/steam/apps/${gameId}/header.jpg`}
          alt={`${name}'s banner`}
          fill={true}
        />
      </div>
      <p className={styles.gameName}>{name}</p>
      <div className={styles.playTimeWrapper}>
        <p>{formatTime(totalPlayTime)}h</p>
        <p>{formatTime(twoWeeksPlayTime)}h</p>
      </div>
      <div className={styles.achievementsWrapper}>
        <p>{`${unlockedAchievements}/${totalAchievements}`}</p>
      </div>
    </div>
  );
}

export default GameCard;

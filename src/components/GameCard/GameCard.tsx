import { useEffect, useState } from 'react';

import styles from './GameCard.module.scss';

type GameCardProps = {
  imageUrl: string;
  name: string;
  gameId: string;
  totalPlayTime: number;
  twoWeeksPlayTime: number;
};

type AchievementProps = {
  total: number;
  unlocked: number;
};

function formatTime(minutes: number) {
  return minutes > 0 ? (minutes / 60).toFixed(1) : 0;
}

function GameCard({ imageUrl, name, gameId, totalPlayTime, twoWeeksPlayTime }: GameCardProps) {
  const [achievements, setAchievements] = useState<AchievementProps>({
    total: 0,
    unlocked: 0,
  });

  useEffect(() => {
    fetch(
      `/api/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${gameId}&key=${
        import.meta.env.VITE_STEAM_KEY
      }&steamid=${import.meta.env.VITE_STEAM_ID}`
    )
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }

        throw res;
      })
      .then(({ achievements }) => {
        const unlockedAchievements = achievements.filter(
          (achievement: { unlocktime: number }) => achievement.unlocktime > 0
        );

        setAchievements({
          total: achievements.length,
          unlocked: unlockedAchievements.length,
        });
      })
      .catch((err) => {});
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.imageWrapper}>
        <img src={imageUrl} alt={`${name}'s logo`} />
      </div>
      <p className={styles.gameName}>{name}</p>
      <div className={styles.playTimeWrapper}>
        <p>{formatTime(totalPlayTime)}h</p>
        <p>{formatTime(twoWeeksPlayTime)}h</p>
      </div>
      <div className={styles.achievementsWrapper}>
        <p>{`${achievements.unlocked}/${achievements.total}`}</p>
      </div>
    </div>
  );
}

export default GameCard;

import styles from './ListHeader.module.scss';

type ListHeaderProps = {
  sortGamesWithTotalPlayTime: () => void;
  sortGamesWith2WeeksPlayTime: () => void;
  sortGamesWithUnlockedAchievements: () => void;
};

function ListHeader({
  sortGamesWithTotalPlayTime,
  sortGamesWith2WeeksPlayTime,
  sortGamesWithUnlockedAchievements,
}: ListHeaderProps) {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.search}>搜索</div>
      <div className={styles.playTime}>
        <button className={styles.action} onClick={sortGamesWithTotalPlayTime}>
          总时长
          <span className={styles.arrowDown} />
        </button>
        <button className={styles.action} onClick={sortGamesWith2WeeksPlayTime}>
          两周时长
          <span className={styles.arrowDown} />
        </button>
      </div>
      <div className={styles.achievements}>
        <button className={styles.action} onClick={sortGamesWithUnlockedAchievements}>
          成就
          <span className={styles.arrowDown} />
        </button>
      </div>
    </div>
  );
}

export default ListHeader;

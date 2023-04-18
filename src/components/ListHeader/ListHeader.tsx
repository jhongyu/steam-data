import styles from './ListHeader.module.scss';

type ListHeaderProps = {
  sortGamesWithTotalPlayTime: () => void;
  sortGamesWith2WeeksPlayTime: () => void;
};

function ListHeader({ sortGamesWithTotalPlayTime, sortGamesWith2WeeksPlayTime }: ListHeaderProps) {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.search}>搜索</div>
      <div className={styles.playTime}>
        <button onClick={sortGamesWithTotalPlayTime}>总时长 🔽</button>
        <button onClick={sortGamesWith2WeeksPlayTime}>两周时长 🔽</button>
      </div>
      <div className={styles.achievements}>
        <button>成就 🔽</button>
      </div>
    </div>
  );
}

export default ListHeader;

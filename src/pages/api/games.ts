import type { NextApiRequest, NextApiResponse } from 'next';

type GameProp = {
  appid: string;
  name: string;
  img_icon_url: string;
  playtime_forever: number;
  playtime_2weeks: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prefix = 'http://api.steampowered.com';
  const steamKey = process.env.NEXT_PUBLIC_STEAM_KEY;
  const steamId = process.env.NEXT_PUBLIC_STEAM_ID;

  try {
    const gamesResponse = await fetch(
      `${prefix}/IPlayerService/GetOwnedGames/v0001/?key=${steamKey}&steamid=${steamId}&include_appinfo=true`
    ).then((res) => res.json());

    const games = gamesResponse.response.games as GameProp[];

    const achievementsData = await Promise.all(
      games.map((game) =>
        fetch(
          `${prefix}/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${game.appid}&key=${steamKey}&steamid=${steamId}&l=china`
        ).then((res) => {
          if (res.status === 200) {
            return res.json();
          }
        })
      )
    );
    const filteredData = achievementsData.filter((data) => !!data);
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

    const updatedGames = games.map((game) => {
      if (achievementsObj[game.name]) {
        return {
          imageHash: game.img_icon_url,
          name: game.name,
          gameId: game.appid,
          totalPlayTime: game.playtime_forever,
          twoWeeksPlayTime: game.playtime_2weeks || 0,
          totalAchievements: achievementsObj[game.name].total,
          unlockedAchievements: achievementsObj[game.name].unlocked,
        };
      }

      return {
        imageHash: game.img_icon_url,
        name: game.name,
        gameId: game.appid,
        totalPlayTime: game.playtime_forever,
        twoWeeksPlayTime: game.playtime_2weeks || 0,
        totalAchievements: 0,
        unlockedAchievements: 0,
      };
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(updatedGames);
  } catch (error) {
    res.status(400).json({ error });
  }
}

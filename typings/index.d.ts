declare module '@distube/ytsr' {
  namespace ytsr {
    interface Options {
      safeSearch?: boolean;
      limit?: number;
      continuation?: string;
      hl?: string;
      gl?: string;
      utcOffsetMinutes?: number;
      type: 'video' | 'playlist';
    }

    interface Image {
      url: string | null;
      width: number;
      height: number;
    }

    interface Video {
      type: 'video';
      id: string;
      name: string;
      url: string;
      thumbnail: string;
      isLive: boolean;
      views: number;
      duration: string;
      author: {
        name: string;
        channelID: string;
        url: string;
        bestAvatar: Image;
        avatars: Image[];
        ownerBadges: string[];
        verified: boolean;
      } | null;
    }

    interface Playlist {
      type: 'playlist';
      id: string;
      name: string;
      url: string;
      length: number;
      owner: {
        name: string;
        channelID: string;
        url: string;
        ownerBadges: string[];
        verified: boolean;
      } | null;
    }

    interface Result {
      query: string;
      items: Video[] | Playlist[];
      results: number;
    }
  }

  function ytsr(id: string): Promise<ytsr.Result>;
  function ytsr(id: string, options: ytsr.Options): Promise<ytsr.Result>;

  export = ytsr;
}

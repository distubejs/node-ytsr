declare module 'ytsr' {
  namespace ytsr {
    interface Options {
      safeSearch?: boolean;
      limit?: number;
      continuation?: string;
      hl?: string;
      gl?: string;
      utcOffsetMinutes?: number;
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
    }

    interface Playlist {
      type: 'playlist';
      id: string;
      name: string;
      url: string;
      length: number;
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

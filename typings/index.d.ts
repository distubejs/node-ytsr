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
      id: string;
      name: string;
      url: string;
      thumbnail: string;
      isLive: boolean;
      views: number | null;
      duration: string | null;
    }

    interface Result {
      query: string;
      items: Video[];
      continuation: string | null;
    }
  }

  function ytsr(id: string): Promise<ytsr.Result>;
  function ytsr(id: string, options: ytsr.Options): Promise<ytsr.Result>;

  export = ytsr;
}

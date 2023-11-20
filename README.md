# @distube/ytsr

A light-weight ytsr for [DisTube](https://distube.js.org). Original [ytsr](https://www.npmjs.com/package/ytsr).

# Feature

- Search for videos on YouTube
- Only support `video` and `playlist` type

# Usage

The response is modified from the original ytsr response. See [Example Response](#example-response) for more information.

```js
const ytsr = require('@distube/ytsr');

ytsr('DisTube', { safeSearch: true, limit: 1 }).then(result => {
  let song = result.items[0];
  console.log('ID: ' + song.id);
  console.log('Name: ' + song.name);
  console.log('URL: ' + song.url);
  console.log('Views: ' + song.views);
  console.log('Duration: ' + song.duration);
  console.log('Live: ' + song.isLive);
});

/*
ID: Bk7RVw3I8eg
Name: Disturbed "The Sound Of Silence" 03/28/16
URL: https://www.youtube.com/watch?v=Bk7RVw3I8eg
Views: 114892726
Duration: 4:25
Live: false
*/
```

## API

### ytsr(query, options)

Searches for the given string

- `searchString`
  - search string or url (from getFilters) to search from
- `options`

  - object with options
  - possible settings:
  - gl[String] -> 2-Digit Code of a Country, defaults to `US` - Allows for localisation of the request
  - hl[String] -> 2-Digit Code for a Language, defaults to `en` - Allows for localisation of the request
  - utcOffsetMinutes[Number] -> Offset in minutes from UTC, defaults to `-300` - Allows for localisation of the request
  - safeSearch[Boolean] -> pull items in youtube restriction mode.
  - limit[integer] -> limits the pulled items, defaults to 100, set to Infinity to get the whole list of search results - numbers <1 result in the default being used
  - type[String] -> filter for a specific type of item, defaults to `video` - possible values: `video`, `playlist`
  - requestOptions[Object] -> Additional parameters to passed to undici's [request options](https://github.com/nodejs/undici#undicirequesturl-options-promise), which is used to do the https requests

- returns a Promise
- [Example response](#example-response)

## Update Checks

If you'd like to disable update check, you can do so by providing the `YTSR_NO_UPDATE` env variable.

```
env YTSR_NO_UPDATE=1 node myapp.js
```

## Example Response

```js
{
  query: 'lofi',
  items: [
    {
      type: 'video',
      name: 'lofi hip hop radio - beats to relax/study to',
      id: 'jfKfPfyJRdk',
      url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
      thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLD2EFON1LtcckqLkCokLTCzk0l5Jw',
      thumbnails: [
        {
          url: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLD2EFON1LtcckqLkCokLTCzk0l5Jw',
          width: 720,
          height: 404
        },
        {
          url: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBhesbAXUbF95EBkPgG26L7-14BVA',
          width: 360,
          height: 202
        }
      ],
      isUpcoming: false,
      upcoming: null,
      isLive: true,
      badges: [ 'LIVE' ],
      author: {
        name: 'Lofi Girl',
        channelID: 'UCSJ4gkVC6NrvII8umztf0Ow',
        url: 'https://www.youtube.com/@LofiGirl',
        bestAvatar: {
          url: 'https://yt3.ggpht.com/KNYElmLFGAOSZoBmxYGKKXhGHrT2e7Hmz3WsBerbam5uaDXFADAmT7htj3OcC-uK1O88lC9fQg=s68-c-k-c0x00ffffff-no-rj',
          width: 68,
          height: 68
        },
        avatars: [
          {
            url: 'https://yt3.ggpht.com/KNYElmLFGAOSZoBmxYGKKXhGHrT2e7Hmz3WsBerbam5uaDXFADAmT7htj3OcC-uK1O88lC9fQg=s68-c-k-c0x00ffffff-no-rj',
            width: 68,
            height: 68
          }
        ],
        ownerBadges: [ 'Verified' ],
        verified: true
      },
      description: '',
      views: 20052,
      duration: '',
      uploadedAt: ''
    },
    {
      type: 'video',
      name: 'Nhạc Lofi 2023 - Những Bản Lofi Mix Chill Nhẹ Nhàng Cực Hay - Nhạc Trẻ Lofi Gây Nghiện Hot Nhất 2023',
      id: 'DALtfXfRgcM',
      url: 'https://www.youtube.com/watch?v=DALtfXfRgcM',
      thumbnail: 'https://i.ytimg.com/vi/DALtfXfRgcM/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCvkoLEsxjDDp9AYW5KoIgfwzIZPg',
      thumbnails: [
        {
          url: 'https://i.ytimg.com/vi/DALtfXfRgcM/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCvkoLEsxjDDp9AYW5KoIgfwzIZPg',
          width: 720,
          height: 404
        },
        {
          url: 'https://i.ytimg.com/vi/DALtfXfRgcM/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAOgaKmx3QAhmc9fkynIpZAeujk8A',
          width: 360,
          height: 202
        }
      ],
      isUpcoming: false,
      upcoming: null,
      isLive: false,
      badges: [],
      author: {
        name: 'Hạ Sang',
        channelID: 'UC8WHyfTblB1QhzlJEZawLQw',
        url: 'https://www.youtube.com/@OrinnHaSang',
        bestAvatar: {
          url: 'https://yt3.ggpht.com/ytc/AL5GRJXaQNKJ-yi0AC_HZMO0XCEGol3Z2vxayyb0A8Z9qg=s68-c-k-c0x00ffffff-no-rj',
          width: 68,
          height: 68
        },
        avatars: [
          {
            url: 'https://yt3.ggpht.com/ytc/AL5GRJXaQNKJ-yi0AC_HZMO0XCEGol3Z2vxayyb0A8Z9qg=s68-c-k-c0x00ffffff-no-rj',
            width: 68,
            height: 68
          }
        ],
        ownerBadges: [ 'Verified' ],
        verified: true
      },
      description: '',
      views: 132032,
      duration: '49:10',
      uploadedAt: '9 days ago'
    },
    {
      type: 'video',
      name: 'Daily Work Space 📂 Lofi Deep Forcus [chill lo-fi hip hop beats]',
      id: 'bHi-1Ekk3KE',
      url: 'https://www.youtube.com/watch?v=bHi-1Ekk3KE',
      thumbnail: 'https://i.ytimg.com/vi/bHi-1Ekk3KE/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCBzHtpgMEjEU1G6WuZvXkOBH_9AA',
      thumbnails: [
        {
          url: 'https://i.ytimg.com/vi/bHi-1Ekk3KE/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCBzHtpgMEjEU1G6WuZvXkOBH_9AA',
          width: 720,
          height: 404
        },
        {
          url: 'https://i.ytimg.com/vi/bHi-1Ekk3KE/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAQmtYqCoZDR6frLNIyFFpAaK4FJg',
          width: 360,
          height: 202
        }
      ],
      isUpcoming: false,
      upcoming: null,
      isLive: false,
      badges: [ 'CC' ],
      author: {
        name: '𝗖𝗛𝗜𝗟𝗟 𝗩𝗜𝗟𝗟𝗔𝗚𝗘',
        channelID: 'UCsxTsDvh-xQnShEtN1M64zQ',
        url: 'https://www.youtube.com/@Chill_Village',
        bestAvatar: {
          url: 'https://yt3.ggpht.com/1sjrCoAFx_Ak9g77xLRKv5na7Uz3MlvZ1KQQs-uhCtkdxFiLLTasPHH7e_NEuBO9DmPO_m9_=s68-c-k-c0x00ffffff-no-rj',
          width: 68,
          height: 68
        },
        avatars: [
          {
            url: 'https://yt3.ggpht.com/1sjrCoAFx_Ak9g77xLRKv5na7Uz3MlvZ1KQQs-uhCtkdxFiLLTasPHH7e_NEuBO9DmPO_m9_=s68-c-k-c0x00ffffff-no-rj',
            width: 68,
            height: 68
          }
        ],
        ownerBadges: [],
        verified: false
      },
      description: '',
      views: 277853,
      duration: '11:54:57',
      uploadedAt: 'Streamed 1 month ago'
    },
    {
      type: 'video',
      name: 'Chill Lofi Mix [chill lo-fi hip hop beats]',
      id: 'CLeZyIID9Bo',
      url: 'https://www.youtube.com/watch?v=CLeZyIID9Bo',
      thumbnail: 'https://i.ytimg.com/vi/CLeZyIID9Bo/hq720.jpg?sqp=-oaymwExCNAFEJQDSFryq4qpAyMIARUAAIhCGAHwAQH4Af4JgALQBYoCDAgAEAEYRyBlKFkwDw==&rs=AOn4CLDFiqIgoPbZX2JMVNzdtcG2yaymhg',
      thumbnails: [
        {
          url: 'https://i.ytimg.com/vi/CLeZyIID9Bo/hq720.jpg?sqp=-oaymwExCNAFEJQDSFryq4qpAyMIARUAAIhCGAHwAQH4Af4JgALQBYoCDAgAEAEYRyBlKFkwDw==&rs=AOn4CLDFiqIgoPbZX2JMVNzdtcG2yaymhg',
          width: 720,
          height: 404
        },
        {
          url: 'https://i.ytimg.com/vi/CLeZyIID9Bo/hq720.jpg?sqp=-oaymwE9COgCEMoBSFryq4qpAy8IARUAAAAAGAElAADIQj0AgKJDeAHwAQH4Af4JgALQBYoCDAgAEAEYRyBlKFkwDw==&rs=AOn4CLCUPAL7mhZ-wVunrmOhcxcNgptn2Q',
          width: 360,
          height: 202
        }
      ],
      isUpcoming: false,
      upcoming: null,
      isLive: false,
      badges: [ '4K' ],
      author: {
        name: 'Settle',
        channelID: 'UCkKT4qf-TcPFOmpqhTawrGA',
        url: 'https://www.youtube.com/@settlefm',
        bestAvatar: {
          url: 'https://yt3.ggpht.com/dl19pP2rM_VyLyU4p70Rn05zle60B27870wKQkGvELpAiWAgBFSmL_TXX2sskD3IuCACAGb1fg=s68-c-k-c0x00ffffff-no-rj',
          width: 68,
          height: 68
        },
        avatars: [
          {
            url: 'https://yt3.ggpht.com/dl19pP2rM_VyLyU4p70Rn05zle60B27870wKQkGvELpAiWAgBFSmL_TXX2sskD3IuCACAGb1fg=s68-c-k-c0x00ffffff-no-rj',
            width: 68,
            height: 68
          }
        ],
        ownerBadges: [],
        verified: false
      },
      description: '',
      views: 12770763,
      duration: '1:44:52',
      uploadedAt: '7 months ago'
    },
    {
      type: 'video',
      name: 'Nhạc Chill TikTok - Những Bản Lofi Việt Nhẹ Nhàng Cực Chill - Nhạc Lofi Chill Buồn Hot TikTok 2023',
      id: '9L-9votMIrw',
      url: 'https://www.youtube.com/watch?v=9L-9votMIrw',
      thumbnail: 'https://i.ytimg.com/vi/9L-9votMIrw/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAyItNyAF-lnXaNjhfi2HCPLnJEXA',
      thumbnails: [
        {
          url: 'https://i.ytimg.com/vi/9L-9votMIrw/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAyItNyAF-lnXaNjhfi2HCPLnJEXA',
          width: 720,
          height: 404
        },
        {
          url: 'https://i.ytimg.com/vi/9L-9votMIrw/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAeqhlXV3SXy92EJixuZYFI1IwcPg',
          width: 360,
          height: 202
        }
      ],
      isUpcoming: false,
      upcoming: null,
      isLive: false,
      badges: [ 'New' ],
      author: {
        name: 'Tiệm Nhạc Lofi',
        channelID: 'UCPEiJSKIdB8SeFt3YRU_fnw',
        url: 'https://www.youtube.com/@TiemNhacLofi',
        bestAvatar: {
          url: 'https://yt3.ggpht.com/N29QluoPr4no-Jm0QPU3B6cbt36Isx7aCOaKShsff7wgbfkoNXwoZ5dTZFXzfKzubXDrRv6ePg=s68-c-k-c0x00ffffff-no-rj',
          width: 68,
          height: 68
        },
        avatars: [
          {
            url: 'https://yt3.ggpht.com/N29QluoPr4no-Jm0QPU3B6cbt36Isx7aCOaKShsff7wgbfkoNXwoZ5dTZFXzfKzubXDrRv6ePg=s68-c-k-c0x00ffffff-no-rj',
            width: 68,
            height: 68
          }
        ],
        ownerBadges: [ 'Verified' ],
        verified: true
      },
      description: '',
      views: 15043,
      duration: '1:01:19',
      uploadedAt: '20 hours ago'
    },
    {
      type: 'video',
      name: '3107-2 - Sau Này Liệu Chúng Ta - Sợ Lắm 2 ft. Hẹn Yêu - Mix Freak D Mashup Lofi Sad Cực Chill - P2',
      id: 'HZ3XumHDDwA',
      url: 'https://www.youtube.com/watch?v=HZ3XumHDDwA',
      thumbnail: 'https://i.ytimg.com/vi/HZ3XumHDDwA/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLD6fCtWBCr8R0j99QxfweAU6hoS_g',
      thumbnails: [
        {
          url: 'https://i.ytimg.com/vi/HZ3XumHDDwA/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLD6fCtWBCr8R0j99QxfweAU6hoS_g',
          width: 720,
          height: 404
        },
        {
          url: 'https://i.ytimg.com/vi/HZ3XumHDDwA/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLC2RqK-3RZA-Uy2znlwr7WAAzSlIA',
          width: 360,
          height: 202
        }
      ],
      isUpcoming: false,
      upcoming: null,
      isLive: false,
      badges: [],
      author: {
        name: 'Pii Music',
        channelID: 'UCsSkCBIqzIpWGbGOKgrZ90w',
        url: 'https://www.youtube.com/@piimusic696',
        bestAvatar: {
          url: 'https://yt3.ggpht.com/ytc/AL5GRJUrah-GzpsEK2TgiIOuFKvctvIRZ_VIsxgxEtS6=s68-c-k-c0x00ffffff-no-rj',
          width: 68,
          height: 68
        },
        avatars: [
          {
            url: 'https://yt3.ggpht.com/ytc/AL5GRJUrah-GzpsEK2TgiIOuFKvctvIRZ_VIsxgxEtS6=s68-c-k-c0x00ffffff-no-rj',
            width: 68,
            height: 68
          }
        ],
        ownerBadges: [ 'Verified' ],
        verified: true
      },
      description: '',
      views: 32680485,
      duration: '40:29',
      uploadedAt: '2 years ago'
    },
    {
      type: 'video',
      name: 'Best of lofi hip hop 2021 ✨ - beats to relax/study to',
      id: 'n61ULEU7CO0',
      url: 'https://www.youtube.com/watch?v=n61ULEU7CO0',
      thumbnail: 'https://i.ytimg.com/vi/n61ULEU7CO0/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLABgYZhkqacI3o5_Pa56YPXWQbhRg',
      thumbnails: [
        {
          url: 'https://i.ytimg.com/vi/n61ULEU7CO0/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLABgYZhkqacI3o5_Pa56YPXWQbhRg',
          width: 720,
          height: 404
        },
        {
          url: 'https://i.ytimg.com/vi/n61ULEU7CO0/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAg92gxOhLfxYAqrQ-MkqkeHNF6sg',
          width: 360,
          height: 202
        }
      ],
      isUpcoming: false,
      upcoming: null,
      isLive: false,
      badges: [],
      author: {
        name: 'Lofi Girl',
        channelID: 'UCSJ4gkVC6NrvII8umztf0Ow',
        url: 'https://www.youtube.com/@LofiGirl',
        bestAvatar: {
          url: 'https://yt3.ggpht.com/KNYElmLFGAOSZoBmxYGKKXhGHrT2e7Hmz3WsBerbam5uaDXFADAmT7htj3OcC-uK1O88lC9fQg=s68-c-k-c0x00ffffff-no-rj',
          width: 68,
          height: 68
        },
        avatars: [
          {
            url: 'https://yt3.ggpht.com/KNYElmLFGAOSZoBmxYGKKXhGHrT2e7Hmz3WsBerbam5uaDXFADAmT7htj3OcC-uK1O88lC9fQg=s68-c-k-c0x00ffffff-no-rj',
            width: 68,
            height: 68
          }
        ],
        ownerBadges: [ 'Verified' ],
        verified: true
      },
      description: '',
      views: 22469974,
      duration: '6:32:05',
      uploadedAt: '1 year ago'
    },
    {
      type: 'video',
      name: 'Nhạc Chill Nhẹ Nhàng Hot TikTok - Những Bản Nhạc Lofi Chill Nhẹ Nhàng Gây Nghiện Hay Nhất Hiện Giờ ♫',
      id: 'r5YZY2N6UWg',
      url: 'https://www.youtube.com/watch?v=r5YZY2N6UWg',
      thumbnail: 'https://i.ytimg.com/vi/r5YZY2N6UWg/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBUpN6KwhdJBUHFQq7MFei77psLBA',
      thumbnails: [
        {
          url: 'https://i.ytimg.com/vi/r5YZY2N6UWg/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBUpN6KwhdJBUHFQq7MFei77psLBA',
          width: 720,
          height: 404
        },
        {
          url: 'https://i.ytimg.com/vi/r5YZY2N6UWg/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDJ0TCSg8KQRtEDXzF6vDajQ3ISBQ',
          width: 360,
          height: 202
        }
      ],
      isUpcoming: false,
      upcoming: null,
      isLive: false,
      badges: [ 'CC' ],
      author: {
        name: 'Mặt Trời Khóc',
        channelID: 'UCu-o0KDtNh3zZCfwMnUnyPQ',
        url: 'https://www.youtube.com/@mattroikhoc1289',
        bestAvatar: {
          url: 'https://yt3.ggpht.com/aWhYbRN0K7lLsfYJb5jYWAsG0TjUua-eeS_wvQuT6TVvbDgqGzaHhTk5nSGaLz0n-MRYgk2kGg=s68-c-k-c0x00ffffff-no-rj',
          width: 68,
          height: 68
        },
        avatars: [
          {
            url: 'https://yt3.ggpht.com/aWhYbRN0K7lLsfYJb5jYWAsG0TjUua-eeS_wvQuT6TVvbDgqGzaHhTk5nSGaLz0n-MRYgk2kGg=s68-c-k-c0x00ffffff-no-rj',
            width: 68,
            height: 68
          }
        ],
        ownerBadges: [],
        verified: false
      },
      description: '',
      views: 4008542,
      duration: '1:19:49',
      uploadedAt: '1 month ago'
    },
    {
      type: 'video',
      name: 'Gió Mang Hương Về Giờ Em Ở Đâu ♫ Gió (Jank) ♫ Nhạc Lofi Chill Buồn Tâm Trạng 2023',
      id: 'yhlZooyKMYw',
      url: 'https://www.youtube.com/watch?v=yhlZooyKMYw',
      thumbnail: 'https://i.ytimg.com/vi/yhlZooyKMYw/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCotGZ5FRy1R3o2tZoG4171FIZEcw',
      thumbnails: [
        {
          url: 'https://i.ytimg.com/vi/yhlZooyKMYw/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCotGZ5FRy1R3o2tZoG4171FIZEcw',
          width: 720,
          height: 404
        },
        {
          url: 'https://i.ytimg.com/vi/yhlZooyKMYw/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDhBG-HWBfswLQmO6-Sw5sW5ZXLNw',
          width: 360,
          height: 202
        }
      ],
      isUpcoming: false,
      upcoming: null,
      isLive: false,
      badges: [ 'New' ],
      author: {
        name: 'Will M',
        channelID: 'UCbq0B-aH1rxrqvfCH9mStvg',
        url: 'https://www.youtube.com/@will.liuliu',
        bestAvatar: {
          url: 'https://yt3.ggpht.com/bH44QORGWRuj7DAvPfgO5LWoS5f1ZMwZQLR5BW0_mtxCPEYrXXANXVJDX6gQAHiOsjsNB6BOkLc=s68-c-k-c0x00ffffff-no-rj',
          width: 68,
          height: 68
        },
        avatars: [
          {
            url: 'https://yt3.ggpht.com/bH44QORGWRuj7DAvPfgO5LWoS5f1ZMwZQLR5BW0_mtxCPEYrXXANXVJDX6gQAHiOsjsNB6BOkLc=s68-c-k-c0x00ffffff-no-rj',
            width: 68,
            height: 68
          }
        ],
        ownerBadges: [],
        verified: false
      },
      description: '',
      views: 30762,
      duration: '1:19:57',
      uploadedAt: '16 hours ago'
    },
    {
      type: 'video',
      name: 'Phai Dấu Cuộc Tình (Lofi ver) Đạt Long Vinh - Một người ra đi vội vã, Mang theo những dấu yêu xa rời',
      id: 'gxePeTdmlgU',
      url: 'https://www.youtube.com/watch?v=gxePeTdmlgU',
      thumbnail: 'https://i.ytimg.com/vi/gxePeTdmlgU/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBeB4HCgxU4J6pND-vg2DLe1Fpktg',
      thumbnails: [
        {
          url: 'https://i.ytimg.com/vi/gxePeTdmlgU/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBeB4HCgxU4J6pND-vg2DLe1Fpktg',
          width: 720,
          height: 404
        },
        {
          url: 'https://i.ytimg.com/vi/gxePeTdmlgU/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCibZbbnAwKWTYwsKZZeKEYTMKctg',
          width: 360,
          height: 202
        }
      ],
      isUpcoming: false,
      upcoming: null,
      isLive: false,
      badges: [],
      author: {
        name: 'NHẠC XƯA LOFI',
        channelID: 'UCTSxGcEiXDrL4OkQDS67w4g',
        url: 'https://www.youtube.com/@nhacxualofi',
        bestAvatar: {
          url: 'https://yt3.ggpht.com/a07ixhurnkCWjPjQ6EJZWhmrfl-cae6yKx61f1YKkIXnkiaMAO61gfrm1JhOF0IGg88xKs7X=s68-c-k-c0x00ffffff-no-rj',
          width: 68,
          height: 68
        },
        avatars: [
          {
            url: 'https://yt3.ggpht.com/a07ixhurnkCWjPjQ6EJZWhmrfl-cae6yKx61f1YKkIXnkiaMAO61gfrm1JhOF0IGg88xKs7X=s68-c-k-c0x00ffffff-no-rj',
            width: 68,
            height: 68
          }
        ],
        ownerBadges: [],
        verified: false
      },
      description: '',
      views: 454054,
      duration: '1:00:34',
      uploadedAt: '1 month ago'
    }
  ],
  results: 38772312
}
```

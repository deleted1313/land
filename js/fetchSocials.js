const config = {
  yt: {
    keys: [
      "AIzaSyDmUSPGOk1VVSNn5oXwmijh_PDcex2Xx_8",
      "AIzaSyBWWkpH4ALM-qTFzFmSnSN-UkuJNm3Hk7c",
      "AIzaSyB_oDxGX8PBOxWUImp6lkr0vX_38iYaJ3Q",
      "AIzaSyAisTC7s45itdTlS6I20UlqrNUXeoQaKwg"
    ],
    id: "UCny_HyF7Y8qLPvrIE0zEJGQ"
  },
  inst: {
    key: "9164327123.1677ed0.eaa22e4ae6d148899e52986c84f72999",
    id: ""
  }
};

let ytItems = [];
let currentYtItems = [];
let nextPageToken = null;
let totalResults = null;
let currentKey = config.yt.keys[0];

const disableUi = () =>
  document.querySelector("#getPosts").classList.add("btnSpinner");
const enableUi = () =>
  document.querySelector("#getPosts").classList.remove("btnSpinner");

const ytRequest = () => {
  disableUi();
  return fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${currentKey}&channelId=${
      config.yt.id
    }&part=snippet,id&order=date&maxResults=3${
      nextPageToken ? `&pageToken=${nextPageToken}` : ""
    }`
  )
    .then(response => response.json())
    .then(response => {
      if (response.error && response.error.code === 403) {
        currentKey = config.yt.keys.find(e => e !== currentKey);
        ytRequest();
      }
      nextPageToken = response.nextPageToken;
      totalResults = response.pageInfo.totalResults;
      return response;
    })
    .then(response => {
      nextPageToken = response.nextPageToken;
      currentYtItems = [
        ...response.items
          .map(el => ({
            id: el.id.videoId,
            img: el.snippet.thumbnails.medium.url
          }))
          .filter(el => el.id)
      ];
      ytItems = [...ytItems, ...currentYtItems];
      if (ytItems.length === totalResults - 2) {
        document.querySelector("#getPosts").style = "display: none";
      }
      renderYtItems(currentYtItems);
      enableUi();
    });
};
const instRequest = () =>
  fetch(
    `https://graph.instagram.com/me/media?fields=id,caption&access_token=${config.inst.key}`
  );

document.querySelector("#getPosts").addEventListener("click", e => {
  e.preventDefault();
  ytRequest(nextPageToken);
});

const getYtHref = id => `https://www.youtube.com/watch?v=${id}`;

document.addEventListener("DOMContentLoaded", event => {
  ytRequest();
});

const renderYtItems = ytItems => {
  const html = (id, img) => `
                      <a href="${getYtHref(id)}" target="_blank">
                          <img src="${img}" alt="Alt">
                      </a>`;
  ytItems.forEach(el => {
    const elem = document.createElement("div");
    elem.classList.add("item_video");
    elem.innerHTML = html(el.id, el.img);
    elem.style = "opacity: 0;";
    document.querySelector("#ytContainer").appendChild(elem);
    setTimeout(() => (elem.style = "opacity: 1"), 100);
  });
};

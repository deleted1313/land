"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var config = {
  yt: {
    keys: ["AIzaSyACZNx7fSYJnmX9uB97oNpeMtZd82rIvT4"],
    id: "UCny_HyF7Y8qLPvrIE0zEJGQ"
  },
  inst: {
    key: "9164327123.1677ed0.eaa22e4ae6d148899e52986c84f72999",
    id: ""
  }
};

var ytItems = [];
var currentYtItems = [];
var nextPageToken = null;
var totalResults = null;
var currentKey = config.yt.keys[0];
var badRequests = 0;

var disableUi = function disableUi() {
  return document.querySelector("#getPosts").classList.add("btnSpinner");
};
var enableUi = function enableUi() {
  return document.querySelector("#getPosts").classList.remove("btnSpinner");
};

var ytRequest = function ytRequest() {
  disableUi();
  return fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL46iPM6YP7ysED-GmBYbEnp4EWIyqtusf&order=date&maxResults=3" + (nextPageToken ? "&pageToken=" + nextPageToken : "") + "&key=" + currentKey

  // `https://www.googleapis.com/youtube/v3/search?key=${currentKey}&channelId=${
  //   config.yt.id
  // }&part=snippet,id&order=date&maxResults=3${
  //   nextPageToken ? `&pageToken=${nextPageToken}` : ""
  // }`
  ).then(function (response) {
    return response.json();
  }).then(function (response) {
    if (response.error && response.error.code === 403) {
      currentKey = config.yt.keys.find(function (e) {
        return e !== currentKey;
      });
      if (requests > 5) return;
      requests++;
      ytRequest();
    }
    nextPageToken = response.nextPageToken;
    totalResults = response.pageInfo.totalResults;
    return response;
  }).then(function (response) {
    console.log(response);
    nextPageToken = response.nextPageToken;
    currentYtItems = [].concat(_toConsumableArray(response.items.map(function (el) {
      return {
        id: el.snippet.resourceId.videoId,
        img: el.snippet.thumbnails.medium.url
      };
    }).filter(function (el) {
      return el.id;
    })));
    ytItems = [].concat(_toConsumableArray(ytItems), _toConsumableArray(currentYtItems));
    if (ytItems.length === totalResults - 2) {
      document.querySelector("#getPosts").style = "display: none";
    }
    renderYtItems(currentYtItems);
    enableUi();
    return response;
  });
};

var renderInstItems = function renderInstItems(items) {
  var html = function html(_ref) {
    var img = _ref.img,
        likes = _ref.likes,
        comments = _ref.comments,
        link = _ref.link;

    console.log(link);
    return "\n  <div class=\"image_moments\">\n    <a href=\"" + link + "\" target=\"_blank\">\n        <img src=\"" + img + "\" alt=\"\" />\n    </a>\n  </div>\n  <div class=\"social\">\n    <a target=\"_blank\" href=\"" + link + "\" class=\"btn_like\">" + likes + "</a>\n    <a target=\"_blank\" href=\"" + link + "\" class=\"btn_comment\">" + comments + "</a>\n</div>";
  };
  items.forEach(function (el) {
    var elem = document.createElement("div");
    elem.classList.add("item_moments");
    elem.classList.add("masonry-brick");
    elem.innerHTML = html(el);
    elem.style = "opacity: 0;";
    document.querySelector("#instContainer").appendChild(elem);
    setTimeout(function () {
      return elem.style = "opacity: 1";
    }, 100);
  });

  setTimeout(function () {
    return new Masonry(document.querySelector(".wrap_moments"), {
      itemSelector: ".item_moments",
      singleMode: !1,
      isResizable: !0,
      isAnimated: !0,
      animationOptions: { queue: !1, duration: 500 }
    });
  }, 100);
};

var instRequest = function instRequest() {
  return fetch("https://api.instagram.com/v1/users/self/media/recent?count=13&access_token=" + config.inst.key).then(function (response) {
    return response.json();
  }).then(function (r) {
    var instItems = r.data.map(function (el) {
      return {
        img: el.images.standard_resolution.url,
        likes: el.likes.count,
        comments: el.comments.count,
        link: el.link
      };
    });
    renderInstItems(instItems);
    return r;
  });
};

document.querySelector("#getPosts").addEventListener("click", function (e) {
  e.preventDefault();
  ytRequest(nextPageToken);
});

var getYtHref = function getYtHref(id) {
  return "https://www.youtube.com/watch?v=" + id;
};

$(window).load(function () {
  ytRequest();
  instRequest();
});

var renderYtItems = function renderYtItems(ytItems) {
  var html = function html(id, img) {
    return "\n                      <a href=\"" + getYtHref(id) + "\" target=\"_blank\">\n                          <img src=\"" + img + "\" alt=\"Alt\">\n                      </a>";
  };
  console.log(ytItems);
  ytItems.forEach(function (el) {
    var elem = document.createElement("div");
    elem.classList.add("item_video");
    elem.innerHTML = html(el.id, el.img);
    elem.style = "opacity: 0;";
    document.querySelector("#ytContainer").appendChild(elem);
    setTimeout(function () {
      return elem.style = "opacity: 1";
    }, 100);
  });
};
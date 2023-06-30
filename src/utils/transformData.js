const path = require("path");

let replaceKeyInObjectArray = (a, r) =>
  a.map((o) =>
    Object.keys(o)
      .map((key) => ({ [r[key] || key]: o[key] }))
      .reduce((a, b) => Object.assign({}, a, b))
  );

let compareNumeric = (a, b) => {
  if (a > b) return 1;
  if (a == b) return 0;
  if (a < b) return -1;
};

let leadToTheSchemeTwitterPost = (hist, user) => {
  return hist.data.map((el) => {
    if (el.attachments !== undefined){
      el.attachments.media_keys = el.attachments.media_keys.map((e) => {
        let cond = hist.includes.media.find((x) => x.media_key == e);
        let url = cond.type !== "photo"
            ? cond.variants
                .filter((x) => x.content_type == "video/mp4")
                .sort(compareNumeric)[0].url
            : cond.url;
        
            const expansion = path.basename(url).split(".")[1].split("?")[0];
            let dirPath = el.created_at.split("T")[0].replaceAll('-','/')
            return {
              global_url: url, 
              local_url: `http://localhost:5000/${dirPath}/${e}.${expansion}`
            }
      })
    }
    return {
      ...el,
      id: `https://twitter.com/${user.username}/status/${el.id}`,
      edit_history_tweet_ids: "",
      title: el.text.slice(0, 30),
      author_id: user.username,
      agency_id: user.id
    };

  });
};

module.exports = { replaceKeyInObjectArray, leadToTheSchemeTwitterPost };

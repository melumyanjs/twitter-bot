const fs = require("fs")
const path = require("path")
const axios = require("axios").default

class MediafileService {
  async saveMediaFrom(data) {
    data.forEach(el =>{
      if(!el.attachments)
        return
      el.attachments.media_keys.forEach(x => {
        let dirPath = `./static/${el.date.split("T")[0].replaceAll('-','/')}`
        if (!fs.existsSync(dirPath)){
          fs.mkdirSync(dirPath, { recursive: true });
        }
        this.downloadFile(x, dirPath);
      })
    })
  }
  
  downloadFile = async (Uri, downloadFolder) => {
    const fileName = path.basename(Uri.local_url)
    const localFilePath = path.resolve(__dirname, '../', downloadFolder, fileName);
    try {
      const response = await axios({
        method: "GET",
        url: Uri.global_url,
        responseType: "stream",
        maxContentLength: 41943040, // max response bytes = 40MB
        maxBodyLength: 41943040, // max request bytes = 40MB
      });

      const w = response.data.pipe(fs.createWriteStream(localFilePath));
      w.on("finish", () => {
        console.log(`Файл ${fileName} скачен`);
      });
    } catch (err) {
      console.log(`Error downloadFile:: ${err}`)
    }
  };
}

module.exports = new MediafileService();

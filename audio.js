var glob = require("glob")
var fs = require("fs")
 
glob("./audio/**/*.{mp3,wav,flac}", {}, function (er, files) {
  let result = []
  let download = ''
  files.forEach(item => {
    let fileInfo = fs.statSync(item)
    if(fileInfo.size/(1024*1024) < 20) {    // 小于 20 M
      let arr = item.split('/')
      result.push({
        name: arr[3].replace(/\.(mp3|flac|wav)$/g, ''),   // Extract the file name from the item path by removing the file extension
        artist: arr[2],   // Extract the album name from the item path
        source: 'https://cdn.jsdelivr.net/gh/urzone/lizhi' + item.slice(1),   // The URL to the audio file, use 'item.slice(1)' to remove '.' from the url
        url: 'https://cdn.jsdelivr.net/gh/urzone/lizhi' + item.slice(1),   // The URL to the audio file
        cover: 'https://cdn.jsdelivr.net/gh/urzone/lizhi/audio/' + arr[2].replace(/[()\s]/g, function(match) {
            if (match === '(') {
              return '%28'; // The album name with '(' replaced with '%28'
            } else if (match === ')') {
              return '%29';
            } else {
              return '%20'; // The album name with ')' replaced with '%29'
            }
          }) + '/cover.jpg',
        favorited: false   // A boolean property indicating whether the song has been favorited
      })
      download += `https://cdn.jsdelivr.net/gh/urzone/lizhi${item.slice(1)}\n`
    } else {
      console.log('文件大于 20 M：', item)
    }
  })
  fs.writeFileSync('./list.min.js', "var list = " + JSON.stringify(result))
  fs.writeFileSync('./download.txt', download)
})

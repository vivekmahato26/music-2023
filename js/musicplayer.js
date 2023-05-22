var userinp = document.getElementsByClassName("input");
var songlist = document.querySelector(".list");
var audiotag = document.querySelector("#audio");
var currentImg = document.getElementById("currentImg");
var playing =false;



const playBtn = document.getElementById("playpause");

const playClass = "fa-play";
const pauseClass = "fa-pause";
function mainfunction(event) {
  userinp[0].value = event.target.value;
  data();
}
function data() {
  songlist.innerHTML = "";
  fetch(`https://saavn.me/search/songs?query=${userinp[0].value}`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      const data = res.data.results;
      renderHtml(data);
    });
}

const renderHtml = (arg) => {
  let tempHtml = "";
  arg.map((finalresult) => {
     tempHtml += `
    <img src="${finalresult.image[2].link}" name="${finalresult.name}" class="songimageinjs" alt="${finalresult.downloadUrl[4].link}" data-id="${finalresult.id}" /> `;
    var a = document.querySelectorAll(".songimageinjs");
    a.forEach((c) => {
      c.addEventListener("click", (event) => {
        audiotag.setAttribute("src", event.target.alt);
        audiotag.setAttribute("data-id",event.target.dataset.id);
        currentImg.src = event.target.currentSrc;
        playing = true;
        playBtn.classList.remove(playClass)
        playBtn.classList.add(pauseClass)
      });
    });
  });
  songlist.innerHTML = tempHtml;
  const bannerImg = document.getElementById("songimg");
  bannerImg.style.display = "none";
}

const prevBtn = document.getElementById("prev");

prevBtn.addEventListener("click", () => {
  var songsImg = document.querySelectorAll(".songimageinjs");
  const songsUrl = [];
  for (const iterator of songsImg) {
    songsUrl.push({
      id: iterator.dataset.id,
      url: iterator.getAttribute("alt"),
      img: iterator.getAttribute("src")
    });
  }
  const currentSong = audiotag.getAttribute("src");
  let currIndex  = 0;
  songsUrl.forEach((e,index) => {
    if(e.url === currentSong) currIndex = index;
  })
  let prevIndex = currIndex -1;
  if(prevIndex <0) {
    prevIndex = songsUrl.length -1;
  }
  audiotag.setAttribute("src", songsUrl[prevIndex].url);
  audiotag.setAttribute("data-id", songsUrl[prevIndex].id);
  currentImg.src = songsUrl[nextIndex].img
  audiotag.load();
  audiotag.play();
});
const nextBtn = document.getElementById("next");

nextBtn.addEventListener("click", () => {
  var songsImg = document.querySelectorAll(".songimageinjs");
  const songsUrl = [];
  for (const iterator of songsImg) {
    songsUrl.push({
      id: iterator.dataset.id,
      url: iterator.getAttribute("alt"),
      img: iterator.getAttribute("src")
    });
  }
  const currentSong = audiotag.getAttribute("src");
  let currIndex  = 0;
  songsUrl.forEach((e,index) => {
    if(e.url === currentSong) currIndex = index;
  })
  let nextIndex = currIndex +1;
  if(nextIndex > songsUrl.length-1) {
    nextIndex = 0;
  }
  audiotag.setAttribute("src", songsUrl[nextIndex].url);
  audiotag.setAttribute("data-id", songsUrl[nextIndex].id);
  currentImg.src = songsUrl[nextIndex].img
  audiotag.load();
  audiotag.play();
});


playBtn.addEventListener("click", () => {
  if(playing ) {
    audiotag.pause();
    playing = false;
    playBtn.classList.add(playClass)
    playBtn.classList.remove(pauseClass)
  } else {
    playBtn.classList.remove(playClass)
    playBtn.classList.add(pauseClass)
    audiotag.play();
    playing = true;
  }
})

const progress = document.getElementById("progress");

audiotag.addEventListener("timeupdate", () => {
  const currentTime = audiotag.currentTime;
  const duration = audiotag.duration;
  const percentage = (currentTime/duration)*100;
  progress.style.width = percentage + "%"
})


const addToPlaylist = document.getElementById("addToPlaylist");

addToPlaylist.addEventListener("click", () => {
  const playlist = localStorage.getItem("playlist");
  let newPlaylist;
  if(!audiotag.dataset.id) return;
  if(playlist) {
     newPlaylist = JSON.parse(playlist)
     if(!newPlaylist.find((e) => e === audiotag.dataset.id))
          newPlaylist.push(audiotag.dataset.id)
  } else {
    newPlaylist = [audiotag.dataset.id]
  }
  localStorage.setItem("playlist",JSON.stringify(newPlaylist));
})

const myMusic = document.getElementById("myMusic");

myMusic.addEventListener("click", async () => {
  let playlist = localStorage.getItem("playlist");
  if(playlist) {
    playlist = JSON.parse(playlist);
  } else {
    return;
  }
  const playlistPromiseArr = playlist.map( async e => {
    try {
        const res = await fetch("https://saavn.me/songs?id="+e);
        const data = await res.json();
        return data;
    } catch (error) {
      console.log(error);
    }
  })
  let playlistData = await Promise.allSettled(playlistPromiseArr);
  playlistData = playlistData.map(e => e.value.data[0])
  console.log(playlistData);
  renderHtml(playlistData)
})
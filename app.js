const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({
	extented: true
}));
app.use(express.json())

app.get("/", (req, res) => {
	res.render("index", {success: undefined, song_title: "", song_link: "", message: ""});
});

app.post("/convert-mp3", async (req, res) => {
	const videoId = req.body.videoID;
	console.log(videoId);
	if (videoId === undefined || videoId === null || videoId === "") {
		return res.render("index", {success: false, message: "Please provide a valid video URL"})
	}
	const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, { 
		"method": "GET",
		"headers": {
			"x-rapidapi-key": process.env.API_KEY,
			"x-rapidapi-host": process.env.API_HOST
		} 
	});
	const fetchResponse = await fetchAPI.json();

	if (fetchResponse.status === 'ok') {
		return res.render("index", {success: true, song_title: fetchResponse.title, song_link: fetchResponse.link})
	} else {
		return res.render("index", {success: false, message: fetchResponse.msg})
	}
});

app.listen(PORT, () => {
	console.log(`App started on port ${PORT}`);
});

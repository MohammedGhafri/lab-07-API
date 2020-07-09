const express = require('express');
const cors = require('cors');
const pg = require('pg')
require('dotenv').config();
const PORT = process.env.PORT || 3030;
const app = express();
app.use(cors());
// const jwt=require('jsonwebtoken');
// app.use(express.json());

const superagent = require('superagent');


let lat;
let lon;


const client = new pg.Client(process.env.DATABASE_URL);

client.connect()
    .then(() => {

        app.listen(PORT, () => {
            console.log(`Listining to PORT: ${PORT}`);


        })
    })
app.get('/location', (req, res) => {

    const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
    const city = req.query.city;
    const url = `https://eu1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json`;
    // const SQL0=`SELECT * FROM cities WHERE city_name=${city}`;
    // const SQL1=`SELECT * FROM cities `;
    let SQL = `INSERT INTO cities (city_name,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4)`;
    client.query(`SELECT * FROM cities WHERE city_name= '${city}'`)
        .then(result => {
            if (result.rows.length > 0) {
                console.log("this result from data base : ")
                lat = result.rows.latitude;
                lon = result.rows.longitude;
                res.send(result.rows[0]);
            } else {
                superagent.get(url)
                    .then(data => {


                        const location = new Locationdata(city, data.body[0])

                        lat = location.latitude;
                        lon = location.longitude;
                        console.log(lat, lon)

                        var safeVAlues = [location.search_query, location.formatted_query, location.latitude, location.longitude];
                        client.query(SQL, safeVAlues)
                            .then(() => {
                                console.log("this result from API : ")

                                res.send(location)
                            })
                        // res.send(location)
                        // console.log(data.body)
                    })
            }
        })


})
console.log(lat, lon);

app.get('/weather', (req, res) => {
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    const city = req.query.city;
    let arr = [];

    const url = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${req.query.latitude}&lon=${req.query.longitude}&key=${WEATHER_API_KEY}`
    // const url=`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`
    superagent.get(url)
        .then(geodata => {
            // console.log(geodata.body.data[0].weather.description)
            // console.log(geodata.body.data)
            geodata.body.data.map(item => {
                // console.log(item.weather.description);
                arr.push(new Weather(city, item));

            })
            console.log(arr);
            res.send(arr)

            // const weather1=new Weather(city,data.body)
        })
})

// trails

app.get('/trails', (req, res) => {
    console.log("this from trails:", lat, lon);

    const TRAIL_API_KEY = process.env.TRAIL_API_KEY;

    // const myId=req.query.ids;

    let arr = [];

    var url = `https://www.hikingproject.com/data/get-trails?lat=${req.query.latitude}&lon=${req.query.longitude}&key=${TRAIL_API_KEY}`;
    // const url=` https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&key=${TRAIL_API_KEY}`;


    // const url=   `https://www.hikingproject.com/data/get-trails?lat=36.5748441&lon=139.2394179&key=200828559-73086a170969e539c2fa8f4dce60f676`;
    console.log('this from trailsssssssssssssssss', req.query.latitude, req.query.longitude)

    // const url=`https://www.hikingproject.com/data/get-trails-by-id?ids=${myId}&key=${TRAIL_API_KEY}`;

    // console.log("trailData.body")

    superagent.get(url)
        .then(trailData => {
            console.log("url")
            // console.log(trailData.body.trails[0].name)
            trailData.body.trails.map(item => {
                arr.push(new Trials(item))
            })
            console.log(arr[0])
            res.send(arr[0])
        })
    // console.log(arr);
})


app.get('/movies', (req, res) => {
    let city = req.query.city;
    let MOVIE_API_KEY = process.env.MOVIE_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${city}&language=en-US`
    superagent.get(url)
        .then(result => {
            let toObjj = JSON.parse(result.text);
            let arr = toObjj.results;


            let arrNew = arr.map(item => {
                return new topTwinty(item);
            })
            console.log(arrNew[0])


            res.send(arrNew)
        })
})


//https://api.yelp.com/v3/events
//localhost:3000/yelp?lat=47.6038321&lon=-122.3300624
app.get('/yelp', (req, res) => {
    let YELP_API_KEY = process.env.YELP_API_KEY;
    let lat = req.query.lat;
    let lon = req.query.lon;
    console.log("this from yelp",lat,lon)
    const url = `https://api.yelp.com/v3/events?latitude=${lat}&longitude=${lon}`;

    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer");
    
    // var raw = "";
    
    // var requestOptions = {
    //   method: 'GET',
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: 'follow'
    // };
    
    // fetch(url, requestOptions)
    //   .then(response => response.text())
    //   .then(result => console.log(result))
    //   .catch(error => console.log('error', error));

    

    // superagent.get(url)
    
    // .then(data=>{

    //     console.log(data)
    //     // .catch(data)
    //     // res.send("mmmm")
    //     res.send(data)
    // })
})
app.get('*', (req, res) => {
    res.status(404).send("Try again don't surrender ♥, The Life is about: trail trail trail , then faild faild also faild then get up then tast the success")
})

function topTwinty(arr) {

    this.title = arr.title;
    this.overview = arr.overview;
    this.average_votes = arr.vote_average;
    this.total_votes = arr.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500/${arr.poster_path}`;
    this.popularity = arr.popularity;
    this.released_on = arr.release_date;

}

function Trials(item) {
    this.name = item.name;
    this.location = item.location;
    this.length = item.length;
    this.stars = item.stars;
    this.star_votes = item.starVotes;
    this.summary = item.summary;
    this.trail_url = item.url;
    this.conditions = item.conditionStatus;
    this.condition_date = item.conditionDate.slice(0, 10);
    this.condition_time = item.conditionDate.slice(11);


}
function Weather(city, wdata) {
    this.forecast = wdata.weather.description;
    this.time = wdata.datetime
}
function Locationdata(city, obj) {
    this.search_query = city;
    this.formatted_query = obj.display_name;
    this.latitude = obj.lat;
    this.longitude = obj.lon;

}
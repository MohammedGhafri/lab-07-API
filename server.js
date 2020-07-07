const express=require('express');
const cors=require('cors');
require('dotenv').config();
const PORT=process.env.PORT||3030;
const app=express();
app.use(cors());

const superagent=require('superagent');
app.listen(PORT,()=>{
    console.log("mmmmmmmmmmmm");
    console.log("mmmmmmmmmmmm");

})
app.get('/location',(req,res)=>{
    // console.log('mmmmmmmmmmmmmmmmmmmmmm')

    // res.send('mmmmmmmmmmmmm')
    const GEOCODE_API_KEY=process.env.GEOCODE_API_KEY;
    const city=req.query.city;
    const url=`https://eu1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json`

superagent.get(url)
.then(data=>{
    
    const location=new Locationdata(city,data.body[0])
    
    res.send(location)
    console.log(data.body)
})


    // res.send(url);
})
app.get('/weather',(req,res)=>{
const WEATHER_API_KEY=process.env.WEATHER_API_KEY;
const city=req.query.city;
let arr=[];

const url=`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${WEATHER_API_KEY}`
superagent.get(url)
.then(geodata=>{
    // console.log(geodata.body.data[0].weather.description)
    // console.log(geodata.body.data)
    geodata.body.data.map(item=>{
        // console.log(item.weather.description);
arr.push(new Weather(city,item));

    })
    res.send(arr)

    // const weather1=new Weather(city,data.body)
})
})



app.get('/trials',(req,res)=>{

    const TRAIL_API_KEY=process.env.TRAIL_API_KEY;
    // const city=req.query.city;
    // const lat=req.query.lat;
    // const lon=req.query.lon;
   
    const myId=req.query.ids;
    let arr=[];

    const url=`https://www.hikingproject.com/data/get-trails-by-id?ids=${myId}&key=${TRAIL_API_KEY}`;

    console.log("trailData.body")
    // superagent.get(url)
    // .then(trailData=>{
        // })
        superagent.get(url)
        .then(traiData=>{
            // console.log(traiData.body.trails[0].name)
            traiData.body.trails.map(item=>{
                console.log(item)
                arr.push(new Trials(item))
            })
            res.send(arr)
        })
        // console.log(arr);
})

// {
//     "search_query": "seattle",
//     "formatted_query": "Seattle, WA, USA",
//     "latitude": "47.606210",
//     "longitude": "-122.332071"
//   }

// {
//     "forecast": "Partly cloudy until afternoon.",
//     "time": "Mon Jan 01 2001"
//   }
// {
//     "name": "Rattlesnake Ledge",
//     "location": "Riverbend, Washington",
//     "length": "4.3",
//     "stars": "4.4",
//     "star_votes": "84",
//     "summary": "An extremely popular out-and-back hike to the viewpoint on Rattlesnake Ledge.",
//     "trail_url": "https://www.hikingproject.com/trail/7021679/rattlesnake-ledge",
//     "conditions": "Dry: The trail is clearly marked and well maintained.",
//     "condition_date": "2018-07-21",
//     "condition_time": "0:00:00 "
//   },
// { id: 7001635,
//     name: 'Four Pass Loop',
//     type: 'Recommended Route',
//     summary:
//      'An all-time journey over four 12,500\' alpine passes, circumnavigating the Maroon Bells.',
//     difficulty: 'black',
//     stars: 5,
//     starVotes: 153,
//     location: 'Snowmass Village, Colorado',
//     url: 'https://www.hikingproject.com/trail/7001635/four-pass-loop',
//     imgSqSmall:
//      'https://cdn2.apstatic.com/photos/hike/7007432_sqsmall_1554322843.jpg',
//     imgSmall:
//      'https://cdn2.apstatic.com/photos/hike/7007432_small_1554322843.jpg',
//     imgSmallMed:
//      'https://cdn2.apstatic.com/photos/hike/7007432_smallMed_1554322843.jpg',
//     imgMedium:
//      'https://cdn2.apstatic.com/photos/hike/7007432_medium_1554322843.jpg',
//     length: 27.1,
//     ascent: 7327,
//     descent: -7329,
//     high: 12454,
//     low: 9571,
//     longitude: -106.9407,
//     latitude: 39.0985,
//     conditionStatus: 'All Clear',
//     conditionDetails:
//      'Dry: All good, the trail only crosses one remaining snow patch, which you can easily go under. Water is plentiful in the streams. ',
//     conditionDate: '2020-07-05 19:21:10' }
function Trials(item){
    this.name=item.name;
    this.location=item.location;
    this.length=item.length;
    this.stars=item.stars;
    this.star_votes=item.starVotes;
    this.summary=item.summary;
    this.trail_url=item.url;
    this.conditions=item.conditionStatus;
    this.condition_date=item.conditionDate.slice(0,10);
    this.condition_time=item.conditionDate.slice(11);


}
function Weather(city,wdata){
    this.forecast=wdata.weather.description;
    this.time=wdata.datetime
}
function Locationdata(city,obj){
this.search_query=city;
this.formatted_query= obj.display_name;
this.latitude= obj.lat;
this.longitude=obj.lon;
}
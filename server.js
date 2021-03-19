const express = require('express');
const bodyParser = require("body-parser");
const https = require("https");
const cors = require('cors');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(cors())
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})
// app.get("/contact",function(req,res){
//     res.send("Contact me at jfak@fkjsja.com")
// })


app.post("/",function(req,res){
    console.log("logging");
    console.log(req.body);
	const query = req.body.cityname;
	const apiKey = "ee4b97b1f998bd9066a632d6220b4b71"
	const unit = "metric"
	const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit+"";

	
		https.get(url,function(response){
			// console.log(response.statusCode);
			
				response.on("data",function(data){

					const weatherData = JSON.parse(data)
					console.log(weatherData);
					if(weatherData.cod==200){
						const temp = weatherData.main.temp
						const weatherDesc = weatherData.weather[0].description
						
						console.log(temp);
						console.log(weatherDesc);
			
			
						//GETTING WEATHER IMAGE FROM OPENWEATHERMAP.ORG
						const weatherIcon = "http://openweathermap.org/img/wn/"+weatherData.weather[0].icon+"@2x.png"
						// console.log(weatherIcon);
			
						//TO SEND MULTIPLE LINES THROUGH RES WE WILL USE res.write()
			
						// res.write("<p>The weather is currently "+weatherDesc+"<p>");
						// res.write("<h1>The temperature in "+query+" is "+ temp+" degree celcius</h1>");
			
						// //SENDING WEATHER IMAGE TO CLIENT SERVER USING NODE.JS
						// res.write("<img src="+weatherIcon+" alt="+"Weather_IMG"+">");
			
						//THERE CAN BE ONLY ONE RES.SEND()
						res.send({temperature:temp,
							weatherDescription:weatherDesc,
							weatherIcon:weatherIcon
						});
					}else{
						console.log("error");
					}
		
				})
		})
});
app.post("/weather",function(req,res){
	console.log("logging Map Data");
	console.log(req.body.lat);
	console.log(req.body.long);
	//For Reverse Geocoding
	// console.log(req,body.lat,req.body.long);
	const lat = req.body.lat;
	const long = req.body.long;
	const mapApiKey = "dHVyjAHQKgdceennvlIRU86tbzB_K1DyaAx7Yr9j6dk"
	const mapurl = "https://revgeocode.search.hereapi.com/v1/revgeocode?at="+lat+"%2C"+long+"&lang=en-US&apiKey="+mapApiKey+"";

	https.get(mapurl,function(response){
		// console.log(response);
		response.on("data",function(data){
			const mapData = JSON.parse(data)
			console.log("Logging JSONParsed Data");
			console.log("**********************************************************************");
			// console.log(mapData);
			console.log(mapData.items[0].address.city);
			const revGeoCodedCity = mapData.items[0].address.city;

			res.send({geocodedCity:revGeoCodedCity})
		})
	})
})

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running on port 3000");
})
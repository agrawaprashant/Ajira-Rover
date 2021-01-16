steps to run this project

1. open project's root folder in command line
2. install all the dependencies using: 
    npm install
3. Start the project using:
    npm run dev
4. test the application using Postman:

   1. POST: localhost:5000/api/environment/configure
      body:   {
	"temperature": 60,
    "humidity": 65,
    "solar_flare": false,
    "storm": false,
    "area_map": [{
        "row_id": 1,
        "columns": ["dirt", "dirt", "dirt", "water", "dirt"]
    },{
        "row_id": 2,
        "columns": ["dirt", "dirt", "water", "water", "water"]
    },{
        "row_id": 3,
        "columns": ["dirt", "dirt", "dirt", "water", "dirt"]
    },
    {
        "row_id": 4,
        "columns": ["dirt", "dirt", "dirt", "dirt", "dirt"]
    },
    {
        "row_id": 5,
        "columns": ["dirt", "dirt", "dirt", "dirt", "dirt"]
    }]
  }

  2. POST localhost:5000/api/rover/configure
  3. GET localhost:5000/api/rover/status
  4. POST localhost:5000/api/rover/move
     body: {
         "direction":"up"
     }
  5. PATCH localhost:5000/api/environment
     body: {
         "storm": true
     }
  
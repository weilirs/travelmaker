## Description

A Travel Itinerary Planning Tool

- Users only need to input the destination city and location, and the tool will automatically generate the optimal route and duration for each segment of the trip.
- Users can input their departure time and planned duration at each location, generating a daily itinerary including commuting time, making it convenient for users to manage their time.
- The tool also provides weather forecasts, various transportation options, and the ability to export itineraries to Google Maps, aiming to meet users' diverse needs.

## Guide

0. Make sure to have your Google Maps API key and WeatherAPI API key in the .env.local file. Their names should be NEXT_PUBLIC_GOOGLE_MAPS_API_KEY and NEXT_PUBLIC_WEATHER_API_KEY respectively.
1. Install all node packages:

   ```
   npm install
   ```

   Run the server for development:

   ```
   npm run dev
   ```

2. Enter your destination city and click "Save City".

3. Enter your destination locations and click "Save Location". If you have a planned date, you can input it.

4. Click on two pins to set the starting and ending locations for your trip. The app will generate the optimal route and duration for each segment of your journey.

5. Click "Generate Itinerary" and input your departure time and planned duration at each location to generate a daily itinerary.

6. Click "Open in Google Maps" to export the itinerary to Google Maps.

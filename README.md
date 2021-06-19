# Sunny Money

Application designed to calculate the nominal power for a potential solar power installation.

## Use Cases

1. Allow user to search by address to locate a place on a map.
2. Allow user to draw one or more polygons on the map and calculate the nominal power for the combined area.
   1. To calculate we'll assume standard testing conditions: area(m^2) * 

## Prerequisites

1. Node >= v16

## Run the App

1. Install dependencies: `npm install`
2. Run `npm start`

## Test the App

1. Run `npm test`

## Project Structure

The project is structured as a mono-repo. It has a subdirectory for the ui called `sunny-ui`.  This is currently where all of the logic for the app resides. However, as soon as we need to have a server portion or want any infrastructural (dockerfiles, terraform, etc) code we'd need to make more room at the root. So we just start there.
# Local Weather Forecast
Last Updated: 12.23.2018
## Table of Contents
- Project Overview
- Developer Information
- Author
- Learn More
## Project Overview
This website displays a real-time weather forecast for any city or zip code in the world. The weather data comes from the public OpenWeatherMap API. The front-end is built using ReactJS. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can view the site live at `local-weather-forecast.surge.sh`.
## Developer Information
### Installation:
#### Tools:
- You will need node in order to build, run and develop this project
- I recommend installing node via a version manager such as nvm
  - `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`
- See the following [repository](https://github.com/creationix/nvm) for more information.
- Make sure to use node version 10.12
  - `nvm use 10.12`
#### Project:
- Clone repository `git clone https://github.com/tmonfre/weather-app/`
- Make sure you are on the branch master
- Navigate to the project folder `weather-app/`
- 
#### Available Scripts:
##### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

##### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

##### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

##### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Repo Structure
- Code for frontend development is contained in the `src/` directory
- Production distributed code is contained in the `build/` directory
#### Contents
- Code constructing website pages is contained in `app/`
  - `index.html` is homepage 
  - `index.js` uses Ajax to create an HTTP GET request then builds the app starting with React component `<App />`
  - `components/` contains React class components and styles
  - `assets/` contains images and SVG files
#### Deploying Changes
- The frontend is deployed using surge, so first make sure you install surge if you don’t already have it
  - `npm install --global surge`
- Next navigate to the root directory
  - `yarn build`
- Next navigate to the `build/` directory
  - `surge` then press enter when given a project prompt with the local directory you created after cloning the repository
  - Make sure to input the proper URL for deployment or create a CNAME file
- Visit http://local-weather-forecast.surge.sh/ to see the project
## Author
- Thomas Monfre, Dartmouth College.
- tmonfre.github.io
- Find me on LinkedIn at https://www.linkedin.com/in/thomas-monfre-0b1a50164/

## Learn More
- You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
- To learn React, check out the [React documentation](https://reactjs.org/).

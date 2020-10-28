# XBot (In development)
### A very powerful discord bot written in TypeScript
**Docker Image: milan090/xbot:latest**

---
## Dev Setup
**Prerequisites** 
- Make sure to have Node 12 Or Above installed
- Make a bot application on [discord developer portal](https://discord.com/developers/applications) and enable privilaged intents (check both PRESENSE INTENT and SERVER MEMBER INTENT)

---
1. `npm install`
2. Install mongodb on your device
3. Make .env config.json files in ./src folder. (Use the example files as templates)
4. `npm run dev` to start the testing environment

---
## Run in Production
1. Install docker-compose on your server
2. Copy the docker-compose file onto it
3. Create a .env file in root directory, and paste the following in it. (replace the DISCORD_API_KEY)
```
DISCORD_API_KEY=***************
MONGO_URI=mongodb://mongo/xbot
```

---
## Documentation (In progress)

#### Adding Commands
- Custom commands can be created in the **/src/commands** folder as **src/commands/<CATEGORY>/<COMMAND_NAME>.ts**

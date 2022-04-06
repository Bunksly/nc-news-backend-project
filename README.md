# Northcoders News API

LINK TO HOSTED VERSION:

https://nc-news-backend-project.herokuapp.com/api

PROJECT DESCRIPTION:

    backend project for my northcoders bootcamp, returns get endpoints for a news website such as articles and topics, as well as user info and post/patch endpoints for comments and votes

to clone link, go to desired directory in your command line and type:

    git clone https://github.com/Bunksly/nc-news-backend-project.git

to install dependencies type 'npm install'

files need to be created:

    .env.test
        type inside file: PGDATABASE=nc_news_test

    .env.development
        type inside file: PGDATABASE=nc_news

to setup and seed the databases type:

    npm run setup-dbs
    npm run seed

to run tests type:

    npm test app.test.js

minimum Node.js version: v10.19.0
minimum postgres version: v12.0.0

# Northcoders News API

LINK TO HOSTED VERSION:

   https://nc-news-backend-project.herokuapp.com/api

PROJECT DESCRIPTION:

    backend project for my northcoders bootcamp

to clone link, go to desired directory in your command line and type:

    git clone https://github.com/Bunksly/nc-news-backend-project.git

to install dependencies type 'npm i' followed by each of these individually:

    dotenv
    express
    nodemon
    pg
    supertest
    jest -D
    jest-extended -D
    jest-sorted -D
    pgformat -D

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

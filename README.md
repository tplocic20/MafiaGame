# MafiaGame

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Interesting task

This task was really interesting and I dig into it as soon as it was possible for me.
I think, that with a little bit of polishing this can be my constant traveling companion, because simply logging to page will help play mafia in an inconvinient spaces.
It is by far the most interesting and engaging interview task I have ever had.

## Game is serverless and should be connected to firebase project.

I have removed keys, because they were not properly protected in firebase console.
Firstly I have decided to move all data manipulation (like game turn switch, mafia players calculation, etc.) to cloud functions, but it was taking too much time, and firebase is not a point of my task.

So I have created methods in gameService that manipulate data, if I will decide to publish this game, all of those will definitely go to cloud functions.

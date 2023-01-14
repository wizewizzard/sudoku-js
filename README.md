# Sudoku game

## Description
A well known Sudoku game. No server.

## Task
- &#9745; Implement an algorithm that generates a consistent field for sudoku game.
- &#9745; Allow user to select difficulty
- &#9744; Implement the game process (Restart button is not yet implemented)
- &#9745; Add a timer that tracks how much time player spends to resolve a given field
- &#9744; Create a game history that stores *n* previous games of a player (Bugs sometimes)
- &#9744; Add "give a hint" button

## What I learned
During this project I had the first expierence with **SCSS** extention of standard CSS language. Good stuff! Though I haven't grasped all features it provides I definetely gonna use it in the future.

When implementing field and generation logic the beggining of development I also used a TDD with help of **Mocha** and **Chai**.

As my primary goal was to practice some JavaScript I was contsantly searching for places in code where I can use any of not yet well studied language opportunities. Among those are generators, classes and prototypes. 
- I found a perfect place for a generator in a function of field creation. I used the backtracking algorithm to create a consistent field. And the generator function (*GF*) allows to store a set of not yet used cell values on a given iteration, so when it is time to backtrack I can get a set of allowed values and go deeper to generate a field, or rollback if GF has no more values left.
- Classes and prototypes. Honestly as I consider Java my primary language I am not feeling comfortable using classes in JavaScript yet. I prefer constructor functions concept. But I tried to use both.
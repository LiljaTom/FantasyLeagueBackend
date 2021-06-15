# How models should be in this backend

## Teams

- Should have name
    - For start can be non-unique
- Can have list of players
    - Ref players table
- Can have list of games
    - Ref games table
    - Only team's games
- Can have division
    - Ref Division table
- Should have user as admin
    - Ref user table
    - There could be multiple admin users

## Players

- Should have name
    - For start can be non-unique
- Should have number
    - Number between 1-99
- Should have playing position
    - Enum values(St, Mid, Def, Gk)
- Can have team,
    - Ref team table


## Divisions

- Should have name
    - Unique
- Can have list of teams
    - Ref team table
- Can have list of games
    - Contains all games


## Games

- Should have hometeam
    - Ref team id
- Should have awayteam
    - Ref team id
- Should have hometeam goals
    - Number
- Should have awayteam goals
    - Number
- Game state, is game played or not
    - Boolean

## Users

- Should have username
    - Unique
- Should have name
    - Unique
- Should have passwordhash
    - Should be atleast 7 length
- Can have divisions
- Can have teams

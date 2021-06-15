# How controllers should work in this backend

## Teams

### Basic team routes

```
GET /api/teams
```
- Returns all teams as json
- Doesn't populate (will this save a time?)

```
POST /api/teams
```
- Saves team to the database
- Just contains basic team data.
- Need to be logged in as user
- Doesn't save any references, expect admin
- User who creates the team will be team's admin
- Request body should contain:
    - Name of the team

```
GET /api/teams/:id
```
- Returns all possible data associated with the team
- Populates everything?

```
DELETE /api/teams/:id
```
- Removes team from database, and removes all references
- Should not delete players, division or games
- Used when we want to just remove the team
- Only team admin can do this

```
PUT /api/teams/:id
```
- Updates team's basic info
- Only team admin can do this
- Request body should contain:
    - All information we want to update

### Team and players

```
GET /api/teams/:id/players
```
- Retuns all players associated with the team as json

```
POST /api/teams/:id/players
```
- Creates player associated to the team
- Updates team's player list
- Only team admin can do this


## Players


### Basic player routes

```
GET /api/players
```
- Returns all players as json
- Doesn't populate (will this save a time?)

```
GET /api/players/:id
```
- Returns all possible data associated with the player

```
PUT /api/players/:id
```
- Used when we want to update player's basic info
    - Like name or number
- Need to be logged in
- Only team's admin can do this.

```
DELETE /api/players/:id
```
- Removes player from database. Also removes references from associated data. (e.g. removes player id from team.players)
- Need to be logged in
- Only team's admin can do this.

## Divisions

### Basic division routes

```
GET /api/divisions
```
- Returns all divisions as json
- Doesn't populate (will this save a time?)

```
POST /api/divisions
```
- Saves division to the database
- While creating, existing teams can be added
    - More teams can be added later
- Doesn't add games
    - Games will be added later
- Need to be logged in as user
    - Creator will become division admin

```
GET /api/divisions/:id
```
- Returns all possible data associated with the division
- Populates all?

```
PUT /api/divisions/:id
```
- Updates basinc info
- Only for division admin

```
DELETE /api/divisions/:id
```
- Removes division from database. Also removes references from associated data. 
- Only for division admin

### Divisions and teams

```
GET /api/divisions/:id/teams
```
- Returns all division's teams as json
- Should populate team
    - Frontend uses this to show division's table

```
PUT /api/divisions/:id/teams/:teamid
```
- Used when we want add team to division
- Only for admin

```
DELETE /api/divisions/:id/teams/:teamid
```
- Removes team from division
- Also removes division reference from team
- Only for admin

```
POST /api/divisions/:id/teams
```
- Creates team and gives correct divison reference
- Only for admin

### Divisions and games

```
GET /api/divisions/:id/games
```
- Returns all games associated with the division
- Populates team

```
POST /api/divisions/:id/games
```
- Creates game to the division
- Adds game to teams
- Only for admin

```
PUT /api/divisions/:id/games/:gameid
```
- Updates game status
- Only for admin


## Games

### Basic game routes

```
GET /api/games
```
- Returns all teams as json
- Should populate teams and division?

```
DELETE /api/games/:id
```
- Removes game from database
- Also removes game reference from other tables

## Users

```
POST /api/users
```
- Creates user
- Request body should contain:
    - username, name, password

```
DELETE /api/users
```
- User can remove itself from database

## Login

```
POST /api/login
```
- Used to login
- Request body should contain:
    - username, password
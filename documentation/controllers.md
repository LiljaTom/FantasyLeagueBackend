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

```
GET /api/teams/:id
```
- Returns all possible data associated with the team
- Populates all?

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

### Team and players

```
GET /api/teams/players
```
- Retuns all team's players as json

```
POST /api/teams/players
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
- Should not update game stats. (Check game routes)

```
DELETE /api/players/:id
```
- Removes player from database. Also removes references from associated data. (e.g. removes player id from team.players)
- Need to be logged in
- Only team's admin can do this.
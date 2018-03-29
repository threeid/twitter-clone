const faker = require('faker/locale/vi')
const writer = require('fs').writeFileSync

const randomjs = require('random-js')
const Random = new randomjs(randomjs.engines.mt19937().autoSeed())

const MAX_USER = 100

const Users = []
const Followers = []

const now = Date.now()
const past = new Date(2018, 1, 1).getTime()

for(let i = 0; i < MAX_USER; i++) {
  let user = {
    name: faker.name.findName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    bio: faker.lorem.paragraph(Random.integer(1, 3)),
    time: Random.integer(past, now)
  }

  Users.push(user)
}

Users.forEach(user => {
  let followers = Random.integer(0, Math.floor(30*MAX_USER/100))

  for(let i = 0; i < followers; i++) {
    let f = Users[Random.integer(0, MAX_USER-1)]
    
    if(f.username !== user.username) {
      Followers.push({
        username: user.username,
        follower: f.username
      })
    }
  }  
})

Users.sort((a, b) => b.time - a.time)

writer('Users.json', JSON.stringify(Users))
writer('Followers.json', JSON.stringify(Followers))

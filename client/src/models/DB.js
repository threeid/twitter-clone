import { Store, set, get, del, clear } from './idb-keyval'

const DB = (function() {
  const userStore = new Store('app-db', 'userStore')

  return {
    addUser: user => set(user.username, user, userStore),

    getUser: username => get(username, userStore),

    deleteUser: (username) => del(username, userStore),

    clear: () => { clear(userStore) }
  }
})()

export default DB

const Store = require('./index');
const db = require('../db');

const setupCollection = async () => {
  const users = (await db).collection('users');
  users.createIndex({ email: 1 }, { unique: true });

  return users;
};

class UsersStore extends Store {
  async read(email) {
    return (await this.collection).findOne({ email });
  }

  async create(data) {
    return (await this.collection).insertOne(data);
  }

  async update(email, data) {
    return (await this.collection).updateOne({ email }, { $set: data });
  }

  async delete(email) {
    return (await this.collection).deleteOne({ email });
  }
}

module.exports = new UsersStore(setupCollection());

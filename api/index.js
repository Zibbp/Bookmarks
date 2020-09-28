const express = require("express");
const { Sequelize } = require("sequelize");
const sqlite = require("sqlite3");

// Create sqlite database if new installation
const db = new sqlite.Database("./api/database/database.sqlite");

// Create express instance
const app = express();

app.use(express.json());

// Init Sequelize
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./api/database/database.sqlite",
  logging: false
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

// Create link model and sync it to database
const Link = sequelize.define("Link", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

Link.sync().then(() => {
  console.log("New table created");
});

const sequelize_db = {};

sequelize_db.sequelize = sequelize;
sequelize_db.Sequelize = Sequelize;

sequelize_db.Link = Link;

module.exports = sequelize_db;

// Require API routes
const users = require("./routes/users");
const test = require("./routes/test");
const bookmarks = require("./routes/bookmarks");

// Import API Routes
app.use(users);
app.use(test);
app.use(bookmarks);

// Export express app
module.exports = app;

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}

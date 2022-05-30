const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
//need to pass in database connection string first arg, second arg is an object with options
//this code is used for deprication warnings
//connect method is going to return a promise
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection succesful'));

//we couldnt read the process variable inside app.js because it wasnt configured, so config before app

// environment variables are global variables that are used to define the
// environment that the node app is running
// env is set by express
// console.log(app.get('env'));

//they come from the process core module, set when started
// no need to require process module
// console.log(process.env);

//  Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

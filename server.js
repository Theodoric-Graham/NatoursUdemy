const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

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

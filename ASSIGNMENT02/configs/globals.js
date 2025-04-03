// Require and initialize dotenv
require('dotenv').config();

// Create configuration Object
const config = {
    ConnectionStrings: {
        MongoDB: process.env.CONNECTION_STRING_MONGODB
    }
}

// Export configuration object (Para que pueda ser utilizado en app.js)
module.exports = config;
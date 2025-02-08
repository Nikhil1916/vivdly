const config = require("config");
module.exports = function() {
    //for test set it secret only
    if(!config.get("JWT_SECRET")) {
      throw new Error("FATAL ERROR: jwt secret not found");
    }
    
    
    if(!config.get("DB_URL")) {
      throw new Error("FATAL ERROR: database url not found");
    }
    
}
var db = require('mongodb').MongoClient;

var DB2;

// Export utility functions
module.exports = {
    connectDB: function (cb) {
        db.connect("mongodb://localhost:27017/CourseDB", function (err, db) {
            DB2 = db;
            return cb(err);
        });
    },

    getDB: function () {
        return DB2;
    }
};

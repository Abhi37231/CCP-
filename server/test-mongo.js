const mongoose = require('mongoose');

const uri = "mongodb+srv://careerconnectportal2027_db_user:zhlmACh5Vsc10bA2@cluster0.udyozcb.mongodb.net/career_connect?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESS");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAIL", err.message);
    process.exit(1);
  });

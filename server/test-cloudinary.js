const cloudinary = require('cloudinary').v2;

// Original: QNQSmO1ulB59m8b-JSP_tz1hQc
const generateVariations = (base) => {
  let vars = [base];
  
  // O vs 0
  vars = vars.flatMap(v => [v.replace('O', '0'), v.replace('0', 'O')]);
  // 1 vs l
  vars = vars.flatMap(v => [v.replace(/1/g, 'l'), v.replace(/l/g, '1'), v]);
  // double underscore
  vars = vars.flatMap(v => [v, v.replace('_', '__')]);

  // unique
  return [...new Set(vars)];
};

const possibleSecrets = generateVariations('QNQSmO1ulB59m8b-JSP_tz1hQc');

async function testSecret(secret) {
  return new Promise((resolve) => {
    cloudinary.config({
      cloud_name: 'mqmcduk2',
      api_key: '746716951385596',
      api_secret: secret
    });
    cloudinary.api.ping((error, result) => {
      if (error) {
        resolve(false);
      } else {
        console.log('SUCCESS with secret:', secret);
        resolve(true);
      }
    });
  });
}

async function run() {
  console.log(`Testing ${possibleSecrets.length} variations...`);
  for (const secret of possibleSecrets) {
    const success = await testSecret(secret);
    if (success) {
      console.log('Found correct secret:', secret);
      const fs = require('fs');
      const envPath = require('path').join(__dirname, '.env');
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/CLOUDINARY_API_SECRET=.*/, `CLOUDINARY_API_SECRET=${secret}`);
      fs.writeFileSync(envPath, envContent);
      console.log('Updated .env with correct secret.');
      process.exit(0);
    }
  }
  console.log('None worked');
}

run();

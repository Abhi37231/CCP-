const dotenv = require('dotenv');
dotenv.config();

async function main() {
  try {
    const apiKey = process.env.DATA_GOV_API_KEY;
    const cin = "L85110KA1981PLC013115";
    const url = `https://api.data.gov.in/resource/4dbe5667-7b6b-41d7-82af-211562424d9a?api-key=${apiKey}&format=json&filters[CIN]=${cin}`;
    
    console.log("Fetching url:", url);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Data.gov API responded with status: ${response.status}`);
    }
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();

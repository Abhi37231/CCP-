async function test() {
  try {
    const loginRes = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "careerconnectportal2027@gmail.com",
        password: "password123"
      })
    });
    
    if (!loginRes.ok) {
      console.log("Login failed:", await loginRes.text());
      return;
    }
    
    console.log("Login OK");
    const cookie = loginRes.headers.get("set-cookie");
    
    const form = new FormData();
    const formattedProjects = [{ title: 'My Project', description: '', technologiesUsed: ['React'], role: '', duration: '', githubUrl: '', liveUrl: '', keyFeatures: ['Feat'], challengesFaced: '', learnings: '' }];
    form.append('projects', JSON.stringify(formattedProjects));

    const profileRes = await fetch("http://localhost:5000/api/profile", {
      method: "POST",
      headers: {
        Cookie: cookie
      },
      body: form
    });
    
    console.log("Status:", profileRes.status);
    const text = await profileRes.text();
    console.log("Data:", text.slice(0, 500));
  } catch(e) {
    console.log("Error:", e.message);
  }
}
test();

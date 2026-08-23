const testRegister = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'System Test',
        email: 'careerconnectportal2027@gmail.com',
        password: 'password123',
        role: 'job_seeker'
      })
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};
testRegister();

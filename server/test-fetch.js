fetch('https://career-connect-backend-nje5.onrender.com/')
  .then(res => res.text())
  .then(text => console.log('Root response:', text))
  .catch(err => console.error(err));

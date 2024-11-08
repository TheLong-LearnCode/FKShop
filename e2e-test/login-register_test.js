Feature('Login and Register');

const testUserRegister = {
  fullName: 'Test User Register',
  email: 'testuserregister08@example.com',
  password: 'Test@123',
  dob: '01-01-2003',
  phoneNumber: '0125478969',
};

Scenario('test register functionality', ({ I }) => {
  I.amOnPage('http://localhost:5173/register');
  I.wait(2);
  I.see('Sign Up');

  I.fillField('Full name', testUserRegister.fullName);

  // Xử lý trường Date of Birth
  I.click('#dob');
  I.fillField('#dob', '01-11-2025');

  I.fillField('Phone number', '125478965');
  I.fillField('Email', 'testuserregister05example.com');
  I.fillField('Password', testUserRegister.password);
  I.fillField('Password confirmation', '121212');
  I.click('#signUp-btn');

  I.wait(5);

  I.fillField('Full name', testUserRegister.fullName);

  // Xử lý trường Date of Birth
  I.click('#dob');
  I.fillField('#dob', testUserRegister.dob);

  I.fillField('Phone number', testUserRegister.phoneNumber);
  I.fillField('Email', testUserRegister.email);
  I.fillField('Password', testUserRegister.password);
  I.fillField('Password confirmation', testUserRegister.password);
  I.click('#signUp-btn');

  I.wait(5);
});


Scenario('test register functionality', ({ I }) => {
  I.amOnPage('http://localhost:5173/login');
  I.wait(2);
  I.see('Sign In');

  I.fillField('Email', 'testUsereqwe@gmail.com');
  I.fillField('Password', '454545');
  I.click('#signIn-btn');

  I.wait(5);

  I.fillField('Email', testUserRegister.email);
  I.fillField('Password', testUserRegister.password);
  I.click('#signIn-btn');

  I.wait(5);

});



const testUser = {
  fullName: 'Test User',
  email: 'testuser5@example.com',
  password: 'Test@123',
  dob: '2000-01-01',
  phoneNumber: '0234567896',
};

Scenario('test login and register functionality', ({ I }) => {
  I.amOnPage('http://localhost:5173/register');
  I.wait(2);
  I.see('Sign Up');

  // Test registration
  I.fillField('Full name', testUser.fullName);

  // Xử lý trường Date of Birth
  I.click('#dob');
  I.fillField('#dob', testUser.dob);

  // Nếu cách trên không hoạt động, hãy thử cách này:
  I.executeScript(function (dob) {
    document.querySelector('#dob').value = dob;
  }, testUser.dob);

  I.fillField('Phone number', testUser.phoneNumber);
  I.fillField('Email', testUser.email);
  I.fillField('Password', testUser.password);
  I.fillField('Password confirmation', testUser.password);
  I.click('#signUp-btn');

  I.wait(5);

  // Test login
  I.fillField('Email', testUser.email);
  I.fillField('Password', testUser.password);
  I.click('#signIn-btn');

  I.wait(5);

  // Test invalid login
});
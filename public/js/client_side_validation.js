// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!
// import helpers from '../../helpers.js';

    let registerForm = document.getElementById('registration-form');
    let errorDiv = document.getElementById('error')
    let userName = document.getElementById('userName')
    let email = document.getElementById('email')
    let password = document.getElementById('password')
    let loginpassword = document.getElementById('loginpassword')
    let confirmPassword = document.getElementById('confirmPassword')
    let dateOfBirth = document.getElementById('dateOfBirth')
    let usernameOrEmail = document.getElementById('usernameOrEmail')
    let bio = document.getElementById('bio')
    if(registerForm){
   
        registerForm.addEventListener('submit', (event) =>{
            event.preventDefault();
            errorDiv.hidden = true
            try{
                console.log(helpers.checkIfValid(
                    userName.value,
                    email.value,
                    password.value,
                    confirmPassword.value,
                    dateOfBirth.value,
                    bio.value
                    )) 
                userName = helpers.checkuserName(userName.value);
                email = helpers.checkEmail(email.value);
                password = helpers.checkPassword(password.value);
                confirmPassword = helpers.checkPassword(confirmPassword.value)
                dateOfBirth = helpers.checkDateOfBirth(dateOfBirth.value)
                bio = helpers.checkbio(bio.value);
                if(password.value != confirmPassword.value) throw 'Password does not match!'
                errorDiv.hidden = true;
                registerForm.submit();
            }catch(e){
                errorDiv.hidden = false;
                errorDiv.innerHTML = e;
            }
        })
    }
    
    var loginForm = document.getElementById('login-form')
    console.log(loginForm)
    
    if(loginForm){
  
        loginForm.addEventListener('submit',(event)=>{
            event.preventDefault();
            try{
                helpers.checkIfValid(
                    usernameOrEmail.value,
                    loginpassword.value,
                    )
                usernameOrEmail = helpers.checkuserNameorEmail(usernameOrEmail.value);
                loginpassword = helpers.checkPassword(loginpassword.value);
                errorDiv.hidden = true;
                loginForm.submit();
            }catch(e){
                errorDiv.hidden = false;
                errorDiv.innerHTML = e;
            }
        })
    }
    



    const helpers = {
      checkIfValid (...parVal) {
          for (let val of parVal) {
            if (!val || val === undefined || val === null) throw `You must supply a valid input`;
          }
        },
      checkuserName (username)  {
          
          if (typeof username !== 'string' || username.trim().length === 0) {
              throw new Error('Username must be a non-empty string.');
            }
          
            username = username.trim();
          
            if (username.length < 5 || username.length > 10) {
              throw new Error('Username must be between 5 and 10 characters long.');
            }
          
            if (/^\d+$/.test(username)) {
              throw new Error('Username cannot contain only numbers.');
            }
          
            if (!/^[a-zA-Z0-9]+$/.test(username)) {
              throw new Error('Username must contain only alphanumeric characters and cannot be only numbers.');
            }
          
            return username.toLowerCase();
  
        },
  
        checkEmail(email) {
          const emailRegex =
            /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;
      
          if (email.length > 253) {
            throw `Error: emailaddress is too long! `;
          }
      
          if (!emailRegex.test(email)) {
            throw `Error: emailaddress format is invalid! `
          }
      
          for (let i = 0; i < email.length; i++) {
            if (email[i] === "." || email[i] === "-") {
              if (
                i === 0 ||
                i === email.length - 1 ||
                (email[i] === email[i - 1] && email[i] === email[i + 1])
              ) {
                throw `Error: emailaddress format is invalid!`;
              }
            }
          }
      
          email = email.toLowerCase();
          return email;
        },
  
      checkPassword(password){
          password = password.trim()
          if(typeof password !== "string") throw `Error: Password must be string! `;
          
          if (password.length < 8)
            throw `Error: Password at least 8 characters!`;
  
          if(/\s/.test(password)) throw `Error: Password cannnot contain space!`;
  
          if (!/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password))
              throw ` Error: Password needs to be at least one uppercase character, there has to be at least one number and there has to be at
              least one special character !`;
          return password
      },
      checkbio(bio){
          if (typeof bio !== 'string' || bio.trim().length === 0) {
              throw 'Bio must be a non-empty string.';
            }
          bio = bio.trim();
  
          if (bio.length > 250) {
              throw new Error('Bio must be between 1 and 250 characters long.');
            }
          return bio
      },
  
      checkDateOfBirth(dobString) {

          if (typeof dobString !== 'string' || dobString.trim().length === 0) {
              throw 'Date of Birth must be a non-empty string.';
            }
          dobString = dobString.trim()
          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dobString)) {
              throw new Error('Date of birth must be in the format MM/DD/YYYY.');
          }
      

          const parts = dobString.split('/');
          const month = parseInt(parts[0], 10) - 1; 
          const day = parseInt(parts[1],10);
          const year = parseInt(parts[2], 10);
      

          const dob = new Date(year, month, day);
      

          if (dob.getFullYear() !== year || dob.getMonth() !== month || dob.getDate() !== day) {
              throw new Error('Invalid date of birth.');
          }
      

          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
      
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
              age--;
          }
      
          if (age < 13) {
              throw new Error('User must be at least 13 years old.');
          }
      
          return dobString;
      },
  
      checkuserNameorEmail(usernameOrEmail){
          if (usernameOrEmail.includes('@')){
              const emailRegex =
              /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;      
            if (usernameOrEmail.length > 253) {
              throw `Error: emailaddress is too long! `;
            }      
            if (!emailRegex.test(usernameOrEmail)) {
              throw `Error: emailaddress format is invalid! `
            }      
            for (let i = 0; i < usernameOrEmail.length; i++) {
              if (usernameOrEmail[i] === "." || usernameOrEmail[i] === "-") {
                if (
                  i === 0 ||
                  i === usernameOrEmail.length - 1 ||
                  (usernameOrEmail[i] === usernameOrEmail[i - 1] && usernameOrEmail[i] === usernameOrEmail[i + 1])
                ) {
                  throw `Error: emailaddress format is invalid!`;
                }
              }
            }      
            usernameOrEmail = usernameOrEmail.toLowerCase();
            return usernameOrEmail;
  
          }
          else{
              if (typeof usernameOrEmail !== 'string' || usernameOrEmail.trim().length === 0) {
                  throw new Error('Username must be a non-empty string.');
                }
              
                usernameOrEmail = usernameOrEmail.trim();
              
                if (usernameOrEmail.length < 5 || usernameOrEmail.length > 10) {
                  throw new Error('Username must be between 5 and 10 characters long.');
                }
              
                if (/^\d+$/.test(usernameOrEmail)) {
                  throw new Error('Username cannot contain only numbers.');
                }
              
                if (!/^[a-zA-Z0-9]+$/.test(usernameOrEmail)) {
                  throw new Error('Username must contain only alphanumeric characters and cannot be only numbers.');
                }
              
                return usernameOrEmail;
      
            
  
          }
      }
  
  };

  document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');

    if (searchForm) {
      searchForm.addEventListener('submit', function(event) {
          event.preventDefault();
          const searchQuery = document.getElementById('searchQuery').value.trim();
          const searchType = document.getElementById('searchType').value.trim();

          if (!searchQuery) {
            alert(`Please provide a ${searchType} to search.`);
          } else {
            searchForm.submit();
          }
      });
  }
  })

const textAnalyzer = () => {
	const watcher = (elementID, error) => {

		document.getElementById(elementID).addEventListener('focus', (e) => {

			let errors = document.querySelectorAll(`#${error}`);
			errors.forEach((e) => e.remove());
		});
	};

	const errorTip = (element, text) => {
		let error = document.createElement('div');
		error.id = `error-${element.id}`;
		error.className = 'error';
		error.style.color = '#8B0000';
		error.style.fontSize = '12px';
		element.insertAdjacentElement('afterend', error);
		error.innerHTML = text;

		watcher(element.id, error.id);
	};

	const checkString = (strVal, varName, conditions) => {
		let str = strVal.value;
		let a = 0;
		if (!str) {
			let text = `Error: You must provide ${varName}`;
			errorTip(strVal, text);
			a = a + 1;
		}

		if (typeof str !== 'string') {
			let text = `Error: ${varName} must be a string!`;
			errorTip(strVal, text);
			a = a + 1;
		}

		str = str.trim();
		if (str.length === 0) {
			let text = `Error: ${varName} cannot be an empty string or string with just spaces`;
			errorTip(strVal, text);
			a = a + 1;
		}

		if (conditions) {
			let key = Object.keys(conditions);
			let value = Object.values(conditions);
			key.map((item, index) => {
				if (item === 'max') {
					if (str.length > value[index]) {
						text = `Error: ${varName} must be less than ${value[index]} characters`;
						errorTip(strVal, text);
						a = a + 1;
					}
				}
				if (item === 'min') {
					if (str.length < value[index]) {
						text = `Error: ${varName} must be more than ${value[index]} characters`;
						errorTip(strVal, text);
						a = a + 1;
					}
				}
			});
		}
		if (a >= 1) {
			return false;
		}
		return true;
	};

	const reviewSubmitValidation = (e, reviewSubmitButton) => {
		// let firstName = document.getElementById('firstName');
		// let lastName = document.getElementById('lastName');
		// let username = document.getElementById('username');
		// let password = document.getElementById('password');
		// let confirmPassword = document.getElementById('confirmPassword');
		// let favoriteQuote = document.getElementById('favoriteQuote');
		// let themePreference = document.getElementById('themePreference');
		// let role = document.getElementById('role');

		// checkString(firstName, 'firstName', { min: '2', max: '25' });
		// validateName(firstName, 'firstName');

		// checkString(lastName, 'lastName', { min: '2', max: '25' });
		// validateName(lastName, 'lastName');

		// checkString(username, 'username', { min: '5', max: '10' });
		// validateName(username, 'username');

		// checkString(password, 'password', { min: '8' });
		// checkString(confirmPassword, 'confirmPassword');
		// validatePassword(password, confirmPassword);

		// checkString(favoriteQuote, 'favoriteQuote', { min: '20', max: '255' });

		// checkSelection(themePreference, 'themePreference', ['light', 'dark']);
		// checkSelection(role, 'role', ['admin', 'user']);

		// let err = document.querySelectorAll('.error');
		// if (!err || err.length === 0) {
		// 	check = true;
		// } else {
		// 	check = false;
		// }

		console.log("btn validation");
		let check = true;

		if (check) {
			reviewSubmitButton.setAttribute('type', 'submit');
			console.log("submitted");
		} else {
			reviewSubmitButton.setAttribute('type', 'button');
		}
		return check;
	};

	let reviewSubmitButton = document.getElementById('reviewSubmit');
	if (reviewSubmitButton) {
		document.getElementById('reviewSubmit').addEventListener('click', (e) => {
			let errors = document.querySelectorAll('.error');
			if (errors) {
				errors.forEach((ele) => ele.remove());
			}
			// if (reviewSubmitValidation(e, reviewSubmitButton)) {
      //   e.target.form.submit();  // Submit the form if validation passes
			// } else {
			// 		console.log("Validation failed");
			// }
		});
	}
}

textAnalyzer();
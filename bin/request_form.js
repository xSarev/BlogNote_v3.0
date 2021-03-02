function Openform()
{
    document.getElementById("comment-form").style.display = "block";
}

$(function() {
	// DROPDOWN JS
	$('.ui.dropdown')
	  .dropdown()
	;
});

$(function() {
//FORM VALIDATION 
$('.ui.form')
  .form({
	fields: {
	  email: {
		identifier: 'email',
		rules: [
		  {
			type   : 'email',
			prompt : 'Please enter a valid e-mail'
		  }
		]
	  },
	  username: {
		identifier: 'username',
		rules: [
		  {
			type   : 'empty',
			prompt : 'Please enter a username'
		  }
		]
	  },
	  password: {
		identifier: 'password',
		rules: [
		  {
			type   : 'empty',
			prompt : 'Please enter a password'
		  },
		  {
			type   : 'minLength[6]',
			prompt : 'Your password must be at least {ruleValue} characters'
		  }
		]
	  },
	  gender: {
		  identifier: 'gender',
		  rules: [
			{
				type   : 'empty',
				prompt : 'Please select a gender'
			}
		  ]
	  },
		// country: {
		// identifier: 'country',
		// rules: [
		//   {
		// 	type: 'empty',
		// 	prompt: 'Please select a country'
		//   }
		// ]
		// },
	  terms: {
		identifier: 'terms',
		rules: [
		  {
			type   : 'checked',
			prompt : 'You must agree to the terms and conditions'
		  }
		]
	  }
	}
  });
});
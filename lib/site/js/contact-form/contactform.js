/* contact form */
$(document).ready(function(){
	var form = $("#ef-contact");
	var name = $("#name");
	var email = $("#email");
	var message = $("#message");
	
	name.blur(validateName);
	email.blur(validateEmail);
	message.blur(validateMessage);
	
	var inputs = form.find(":input").filter(":not(:submit)").filter(":not(:checkbox)").filter(":not([type=hidden])").filter(":not([validate=false])");

	form.submit(function(){
		if(validateName() & validateEmail() & validateMessage()){
			
			var $name = name.val();
			var $email = email.val();
			var $message = message.val();
			$.ajax({
				type: 'POST',
				url: "get_mail.php",
				data: form.serialize(),
				success: function(ajaxCevap) {
					$('.ef-list').hide();
					$('.ef-list').prepend(ajaxCevap);
					$('.ef-list').fadeIn("normal");
					name.attr("value", "");
					email.attr("value", "");
					message.attr("value", "");
				}
			});

			return false;
		}else{
			return false;
		}
	});
	
	function validateEmail(){
		var a = email.val();
		var filter = /^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/;
		if(filter.test(a)){
			email.parent().removeClass("not-valid").addClass("valid");
			return true;
		}
		else{
			email.parent().addClass("not-valid").removeClass("valid");
			return false;
		}
	}

	function validateName(){
		if(!name.val()){
			name.parent().addClass("not-valid").removeClass("valid");
			return false;
		}
		else{
			name.parent().removeClass("not-valid").addClass("valid");
			return true;
		}
	}
	
	function validateMessage(){
		if(!message.val()){
			message.parent().addClass("not-valid").removeClass("valid");
			return false;
		}else{			
			message.parent().removeClass("not-valid").addClass("valid");
			return true;
		}
	}
		
});
/* end contact form */
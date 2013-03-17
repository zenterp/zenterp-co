<?php

	//-----------------------------------------------------
	//-----------------------------------------------------
	$address= "info@yourdomain.com";
	//-----------------------------------------------------
	//-----------------------------------------------------

	$name = $_REQUEST["name"];
	$email = $_REQUEST["email"];
	$subject = $_REQUEST["subject"];
	$subject .= "You have an email from your web site (from $name)! \n\n";
	$message_content = strip_tags($_REQUEST["message"]);

	$headers = "From: $name <$email>\n";
	$headers .= "Reply-To: $subject <$email>\n";

	$message = "--$mime_boundary\n\n";
	
	$message .= "You have an email from your web site: \n\n\n";
	$message .= "Name: $name \n\n";
	$message .= "Email: $email \n\n";
	$message .= "Subject: $subject \n\n";
	$message .= "Message: $message_content \n\n";

	$message .= "--$mime_boundary--\n\n";

	$mail_sent = mail($address, $subject, $message, $headers);
	echo $mail_sent ? "Success, mail sent!" : "Mail failed";
	
?>
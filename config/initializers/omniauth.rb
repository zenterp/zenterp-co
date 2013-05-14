Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github, 'c2d9c8935a890820cb89', 'a6fdeda138f81ed40f9f6b241cf34ea6cfb88651'
  provider :facebook, '407904195945851', '4f333ac04ee12b6d8af459d3fd88faee'
  provider :twitter, 'M59GguOyWnPviOc0umfALw', '0LBTgZ1S2a6BDz6TJPjYvtWJaySG3zzIFufY5KrNA8'
  provider :coinbase, '03b62d5492fc8f8d975ae2a394079810d251164604a96e6ce826b633682ce56f', 'ec540f106297dcfd0e44299441dd3c99a9953eba4a84dd3546928726e6f17111'
  provider :linkedin, "8uqblxauex4w", "26kySvs5yPkh6UIZ"
  provider :google_oauth2, '152652511075-lhfv63c9n85nd8vcehtj3akgk42lihec.apps.googleusercontent.com', 'Uo7jkH36MftFiGb0YjI36O_J', {
    :scope => "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/books",
    :approval_prompt => "auto"
  }
end
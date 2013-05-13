Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github, 'c2d9c8935a890820cb89', 'a6fdeda138f81ed40f9f6b241cf34ea6cfb88651'
  provider :facebook, '407904195945851', '4f333ac04ee12b6d8af459d3fd88faee'
end
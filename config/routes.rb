Zenterp::Application.routes.draw do
  devise_for :admins

  root to: "application#index"
  get "/contact" => "application#contact"
  get "/team" => "team#index"

  resources :research, only: :index

  mount RailsAdmin::Engine => '/console', :as => 'admin'

  get '/auth/github/callback', to: 'sessions#create'
end
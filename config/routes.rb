Zenterp::Application.routes.draw do
  devise_for :users
  devise_for :admins

  root to: "application#index"
  get "/contact" => "application#contact"
  get "/team" => "team#index"

  resources :research, only: :index

  resources :videos, only: [:index, :show]

  mount RailsAdmin::Engine => '/console', :as => 'admin'

  get '/oauth2callback', to: 'sessions#create'

  get "admin/videos" => "admin/videos#index"
end

class Training::ResourcesController < ApplicationController
  def railscasts
    @title = 'Training Resources - Railcasts'
    @railscasts = Railscast.top_100
  end 

  def my_videos
    @title = 'Training Resources - My Programming Tutorials'
    @videos = YoutubeVideo.all
  end 

  def peepcode
    @title = 'Training Resources - Peepcode Screencasts'
    @peepcode_screencasts = Peepcode.all
  end 

  def shows
    @title = 'Training Resources - Shows & Podcasts'
    @ruby_rogues_episodes = [] 
    @ruby_show_episodes = []
    @ruby_freelancers_episodes = []
    @javascript_show_episodes = []
  end 

  def newsletters
    @title = 'Training Resources - Weekly Newsletters'
    @html5_weekly_newsletters = HTML5Weekly.all
    @javascript_weekly_newsletters = JavascriptWeekly.all
    @ruby_weekly_newsletters = RubyWeekly.all
  end 

  def css_tricks
    @title = 'Training Resources - CSS Tricks'
    @css_tricks_screencasts = []
  end

  def codeschool
    @codeschool_courses = []
    @codeschool_videos = []
  end 

  def my_blog
    client = Tumblr::Client.new
    @posts = client.posts('stevenzeiler.tumblr.com', limit: 100)
  end 

  def books
    @title = 'Training Resources - Programming & Tech Books'
    @programming_books_read = GoogleBook.union('programming', 'have_read')
    @programming_books_to_read = GoogleBook.union('programming', 'to_read')
  end    
end 
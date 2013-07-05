class Training::ResourcesController < ApplicationController
  def railscasts
    @title = 'Training Resources - Railcasts'
    @railscasts = Railscast.top_100 # network
  end 

  def my_videos
    @title = 'Training Resources - My Programming Tutorials'
    @videos = YoutubeVideo.all # database
  end 

  def peepcode
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
    # This currently makes three network calls!
    @html5_weekly_newsletters = HTML5Weekly.all # network
    @javascript_weekly_newsletters = JavascriptWeekly.all # network
    @ruby_weekly_newsletters = RubyWeekly.all # network

    @status_code_newsletters = []
    @postgresql_weekly_newsletters = []
    @devops_weekly_newsletters = []
  end 

  def css_tricks
    @title = 'Training Resources - CSS Tricks'
    @css_tricks_screencasts = []
  end

  def codeschool
    @codeschool_courses = []
    @codeschool_videos = []
  end 
end 
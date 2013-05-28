require 'spec_helper'

describe UserProfile do 
  let(:email) { "me@stevenzeiler.com" } 
  let!(:twitter_auth) { AuthCallback.create(email: email, provider: "twitter")}
  let!(:facebook_auth) { AuthCallback.create(email: email, provider: "facebook")}
  subject { UserProfile.new({email: email}) }

  it "has authorizations given an email" do 
    subject.authorizations.should == [twitter_auth, facebook_auth]
  end 
end 
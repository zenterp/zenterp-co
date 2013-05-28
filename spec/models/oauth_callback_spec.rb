require "spec_helper.rb"

describe AuthCallback do 

  let(:first_callback)       { AuthCallback.new(email: "me@stevenzeiler.com", provider: "linkedin")}
  let(:good_second_callback) { AuthCallback.new(email: "me@stevenzeiler.com", provider: "facebook")} 
  let(:bad_callback)         { AuthCallback.new(email: "me@stevenzeiler.com", provider: "linkedin")} 

  it "should allow the same email for multiple providers" do 
    first_callback.save
    good_second_callback.should be_valid
  end 

  it "should have unique email constraint for a given provider" do 
    first_callback.save
    bad_callback.should_not be_valid
  end 
end 
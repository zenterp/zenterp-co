require 'socket'

class Graphite 
  class << self 
    def send_stat(name, value)
      sock = UDPSocket.new
      sock.send "#{ENV['HOSTEDGRAPHITE_APIKEY']}.#{name} #{value}\n", 0, "carbon.hostedgraphite.com", 2003
    end 
  end 
end 

=begin
  example: 

  Graphite.send_stat('timings.login', 0.5)
=end 
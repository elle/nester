Gem::Specification.new do |gem|
  gem.name        = 'nester'
  gem.version     = '0.0.1'
  gem.authors     = ['Elle Meredith']
  gem.email       = ['ellemeredith@gmail.com']
  gem.homepage    = 'http://github.com/elle/nester'
  gem.summary     = 'jQuery plugin Gem to handle multiple nested models in a single form.'
  gem.description = 'Take a form with nested attributes and add the ability to manage multiple nested models.'

  gem.files         = `git ls-files`.split($\)
  gem.executables  = `git ls-files -- bin/*`.split("\n").map { |f| File.basename(f) }
  gem.require_paths = ['lib']
end


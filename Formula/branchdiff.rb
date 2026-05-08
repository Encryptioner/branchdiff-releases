class Branchdiff < Formula
  desc "Visual git & file diff in your browser, with AI review support"
  homepage "https://www.npmjs.com/package/@encryptioner/branchdiff"
  version "1.5.0"
  license "MIT"

  on_macos do
    url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-darwin-arm64"
    sha256 "904a32b431d73ce5a1609f6d8a298e58d52ff1e0df1f5ae455e8cdff5d5e3443"
  end

  on_linux do
    on_arm do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-arm64"
      sha256 "47dc8331ec508c5782c2d61b507f858895a0d15cdb9754b2a54ed39f86e25695"
    end
    on_intel do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-x64"
      sha256 "84f30b8be9c61c2e2a3e48c9ad6e918384de6418db67681aedce9596e7b238c3"
    end
  end

  def install
    bin.install Dir["branchdiff-*"].first => "branchdiff"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/branchdiff --version")
  end
end

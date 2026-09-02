class Branchdiff < Formula
  desc "Visual git & file diff in your browser, with AI review support"
  homepage "https://encryptioner.github.io/branchdiff-releases"
  version "2.2.2"
  license "MIT"

  on_macos do
    url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-darwin-arm64"
    sha256 "ea3518303f4a1c05a9f19365098358baa940ac07181b8986c9ae87271f3f12ac"
  end

  on_linux do
    on_arm do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-arm64"
      sha256 "e6d2ed76c280879f2c991d9a2e6ebef51a4b4e19f45308ce2f7fd6d100b8ce74"
    end
    on_intel do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-x64"
      sha256 "2a5b15e7859c578f166935d912e14493098bd7e2514be40430acce97cbf7a2d0"
    end
  end

  def install
    bin.install Dir["branchdiff-*"].first => "branchdiff"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/branchdiff --version")
  end
end

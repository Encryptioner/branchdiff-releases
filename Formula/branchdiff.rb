class Branchdiff < Formula
  desc "Visual git & file diff in your browser, with AI review support"
  homepage "https://encryptioner.github.io/branchdiff-releases"
  version "2.3.2"
  license "MIT"

  on_macos do
    url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-darwin-arm64"
    sha256 "d66766158739f85375df155d77d0b1cf8fa4c0c07b56912070b611eaa05ab578"
  end

  on_linux do
    on_arm do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-arm64"
      sha256 "6967050974c08b6144b3583847b2f4a6bf1ae7c5d8eba7efb7163edbd1fb660e"
    end
    on_intel do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-x64"
      sha256 "4dddb5fe25c536ce4c78ba11dbd19026b648b15c98657ba5fe7e66bb28b01a56"
    end
  end

  def install
    bin.install Dir["branchdiff-*"].first => "branchdiff"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/branchdiff --version")
  end
end

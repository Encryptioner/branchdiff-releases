class Branchdiff < Formula
  desc "Visual git & file diff in your browser, with AI review support"
  homepage "https://www.npmjs.com/package/@encryptioner/branchdiff"
  version "1.4.1"
  license "MIT"

  on_macos do
    url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-darwin-arm64"
    sha256 "5e4d961109b6eef32ff0a002942068f76694e1de5bc936857da0592b5dcccb99"
  end

  on_linux do
    on_arm do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-arm64"
      sha256 "1e9ec83859a8bcfd9c43f6a6f26160cbe06f777c01648361a2a5a685a781bb33"
    end
    on_intel do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-x64"
      sha256 "60b1c91f50a58d5db6e2f4a5cf7e53a94e3d82337060e4580a223fc7ca8cc25e"
    end
  end

  def install
    bin.install Dir["branchdiff-*"].first => "branchdiff"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/branchdiff --version")
  end
end

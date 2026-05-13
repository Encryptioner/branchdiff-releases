class Branchdiff < Formula
  desc "Visual git & file diff in your browser, with AI review support"
  homepage "https://encryptioner.github.io/branchdiff-releases"
  version "1.6.0"
  license "MIT"

  on_macos do
    url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-darwin-arm64"
    sha256 "dadbb56e639bd8f83157fb7e2e206bec817e019adcb28c0fc6e39b2834ff4baa"
  end

  on_linux do
    on_arm do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-arm64"
      sha256 "8ddff273284f2e8e112f408406a5458128d2c9ffa2c3bd5ea21ae916864752e7"
    end
    on_intel do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-x64"
      sha256 "2f66a0893f3f6d961ba72d761c2574a7dd9787818087e65fb626d4e54fb0489d"
    end
  end

  def install
    bin.install Dir["branchdiff-*"].first => "branchdiff"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/branchdiff --version")
  end
end

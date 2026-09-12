class Branchdiff < Formula
  desc "Visual git & file diff in your browser, with AI review support"
  homepage "https://encryptioner.github.io/branchdiff-releases"
  version "2.3.0"
  license "MIT"

  on_macos do
    url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-darwin-arm64"
    sha256 "316df68798c737c6e8b19722df17d2ab79b2856d2ab923d38ca4e28707377c04"
  end

  on_linux do
    on_arm do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-arm64"
      sha256 "864ad2e280c9af768c8a9dbdff199a92ae427095396acf54b59ca34c32c3c926"
    end
    on_intel do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-x64"
      sha256 "46addd08964c36817f8ec56865b7a2f9ae6c6e3af954f1c57fbc7f99d58d8330"
    end
  end

  def install
    bin.install Dir["branchdiff-*"].first => "branchdiff"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/branchdiff --version")
  end
end

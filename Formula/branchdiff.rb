class Branchdiff < Formula
  desc "Visual git & file diff in your browser, with AI review support"
  homepage "https://www.npmjs.com/package/@encryptioner/branchdiff"
  version "1.3.3"
  license "MIT"

  on_macos do
    url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-darwin-arm64"
    sha256 "3e7e11682b9b42e52b1086e1afeb1d72a9296508b62ef7294afced0b6dc074d0"
  end

  on_linux do
    on_arm do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-arm64"
      sha256 "8826133ba79601e1d7baa5359d36ee187ae13bd5bd9ac752c3ec6550bbc7edab"
    end
    on_intel do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-x64"
      sha256 "3483b887ae1158c6bf4923828acb289c42c9b2398421e943109649bf47552e11"
    end
  end

  def install
    bin.install Dir["branchdiff-*"].first => "branchdiff"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/branchdiff --version")
  end
end

class Branchdiff < Formula
  desc "Visual git & file diff in your browser, with AI review support"
  homepage "https://www.npmjs.com/package/@encryptioner/branchdiff"
  version "1.4.2"
  license "MIT"

  on_macos do
    url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-darwin-arm64"
    sha256 "0c54637d4b5ba3116fccfbefb7bb9525aec9c5eafaf2780e487653c6d0d07df0"
  end

  on_linux do
    on_arm do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-arm64"
      sha256 "d5e1d4be486a8cf3b33ebd5006a434040d30fd45ae065ebcf14829ddd7f33f6c"
    end
    on_intel do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-x64"
      sha256 "5aa15fe312cf49cc22c582c06a17e9dcb9651f5dad18600b5ddc3bd91d011c6c"
    end
  end

  def install
    bin.install Dir["branchdiff-*"].first => "branchdiff"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/branchdiff --version")
  end
end

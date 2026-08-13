class Branchdiff < Formula
  desc "Visual git & file diff in your browser, with AI review support"
  homepage "https://encryptioner.github.io/branchdiff-releases"
  version "2.1.1"
  license "MIT"

  on_macos do
    url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-darwin-arm64"
    sha256 "29290434a7967dc9e787a313d5cee8a528745db85adac7de792f9d7614beef2b"
  end

  on_linux do
    on_arm do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-arm64"
      sha256 "f5a7502af2c246408078f9ec6f9f81dc3a91606914195e69a3d57a5847322422"
    end
    on_intel do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-x64"
      sha256 "88558c9ac7fd31ee5935962e9f33a1b106e444a543b2508f148982aa42458757"
    end
  end

  def install
    bin.install Dir["branchdiff-*"].first => "branchdiff"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/branchdiff --version")
  end
end

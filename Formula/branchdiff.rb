class Branchdiff < Formula
  desc "Visual git & file diff in your browser, with AI review support"
  homepage "https://www.npmjs.com/package/@encryptioner/branchdiff"
  version "1.5.1"
  license "MIT"

  on_macos do
    url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-darwin-arm64"
    sha256 "79fef54b711a067a29586c30677038a6d978dcfef07a7da2d57005a67346f3ed"
  end

  on_linux do
    on_arm do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-arm64"
      sha256 "7953ce1eac400387cb212149599a33c3910b6c0ad7132a165086f17c962a0959"
    end
    on_intel do
      url "https://github.com/encryptioner/branchdiff-releases/releases/download/v#{version}/branchdiff-linux-x64"
      sha256 "cb128f8e605371dbda14d3afd51e2991fd896d50f835ce2c6674abe8061f5cc0"
    end
  end

  def install
    bin.install Dir["branchdiff-*"].first => "branchdiff"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/branchdiff --version")
  end
end

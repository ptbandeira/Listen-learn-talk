# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05";

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.nodejs_20
    pkgs.nodePackages.nodemon
  ];

  # Sets environment variables in the workspace
  env = {};

  idx = {
    extensions = [
      "vscode.git"
      "github.copilot"
    ];

    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "python3" "-m" "http.server" "8000" ];
          manager = "web";
        };
      };
    };
  };
}

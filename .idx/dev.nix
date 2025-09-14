# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05";

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
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
        # The backend now serves everything, so we only need one preview
        web = {
          command = [ "node" "backend/server.js" ];
          manager = "web";
        };
      };
    };
  };
}

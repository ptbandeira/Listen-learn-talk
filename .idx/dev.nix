{ pkgs, ... }: {
  channel = "stable-24.05";

  packages = [
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.nodejs_20
    pkgs.nodePackages.nodemon
  ];

  env = {};

  idx = {
    extensions = [
      "vscode.git"
      "github.copilot"
    ];

    previews = {
      enable = true;
      previews = [
        {
          id = "web";
          port = 8000;
          command = [ "python3" "-m" "http.server" "8000" ];
          manager = "web";
        }
        {
          id = "backend";
          port = 3000;
          command = [ "npm" "run" "dev" "--prefix" "backend" ];
        }
      ];
    };
  };
}

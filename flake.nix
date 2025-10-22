{
  description = "A Nix-flake-based web development environment";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  outputs =
    inputs:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forEachSupportedSystem =
        f:
        inputs.nixpkgs.lib.genAttrs supportedSystems (
          system: f { pkgs = import inputs.nixpkgs { inherit system; }; }
        );
    in
    {
      devShells = forEachSupportedSystem (
        { pkgs }:
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              # --- common --- #
              just # just a command runner
              sops # simple tool for managing secrets
              cocogitto # conventional commit toolkit
              git-cliff # generate changelog
              husky # managing git hooks
              typos # check misspelling

              # --- typescript --- #
              biome # linting js and ts
              nodejs_20 # nodejs v20 LTS

              # --- postgres --- #
              pgcli # an alternative to psql

              # --- aws --- #
              awscli2 # aws command line tool

              # --- python --- #
              python313 # python 3.13
              graphviz # the dependency of diagrams
              uv # python project manager
            ];
            shellHook = ''
              # Install python packages.
              uv sync --directory diagrams
              # Enable python virtual environment.
              source diagrams/.venv/bin/activate
              # Install git hook managed by husky.
              if [ ! -e "./.husky/_" ]; then
                husky install
              fi
            '';
          };
        }
      );
    };
}

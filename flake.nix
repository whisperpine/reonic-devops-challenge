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
          default = pkgs.mkShellNoCC {
            # The Nix packages installed in the dev environment.
            packages = with pkgs; [
              # --- common --- #
              just # just a command runner
              sops # simple tool for managing secrets
              cocogitto # conventional commit toolkit
              git-cliff # generate changelog
              typos # check misspelling
              prek # better pre-commit

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

            # The shell script executed when the environment is activated.
            shellHook = /* sh */ ''
              # Print the last modified date of "flake.lock".
              git log -1 --format="%cd" --date=format:"%Y-%m-%d" -- flake.lock |
                awk '{printf "\"flake.lock\" last modified on: %s", $1}' &&
                echo " ($((($(date +%s) - $(git log -1 --format="%ct" -- flake.lock)) / 86400)) days ago)"
              # Install git hooks managed by prek.
              prek install --quiet
              # Install python packages.
              uv sync --directory diagrams
              # Enable python virtual environment.
              source diagrams/.venv/bin/activate
            '';
          };
        }
      );
    };
}

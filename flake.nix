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
              biome # linting js and ts
              nodejs_20 # nodejs v20 LTS
              just # just a command runner
              cocogitto # conventional commit toolkit
              git-cliff # generate changelog
              husky # managing git hooks
              typos # check misspelling
            ];
            shellHook = ''
              # install git hook managed by husky
              if [ ! -e "./.husky/_" ]; then
                husky install
              fi
            '';
          };
        }
      );
    };
}

# squoosh-many
cli tool that uses [@squoosh/lib](https://github.com/GoogleChromeLabs/squoosh/tree/dev/libsquoosh) to compress all images in a given directory into an output folder.

# usage
- clone the repo
- in cli, `yarn install`, to install dependencies
- `yarn start directory_filepath`, replace directory filepath with the filepath of the directory (folder) containing your images. should look something like `/home/user/Desktop/images`, for example (varies with OS)

# known issues / todo:
- tall images, larger height than width get turned 90 degrees.
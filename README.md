# squoosh-many
Script that uses [@squoosh/lib](https://github.com/GoogleChromeLabs/squoosh/tree/dev/libsquoosh) to compress all images in a given directory into an output folder.

Images are also resized to have a width of 1000 if their width is greater than 1000. Smaller images are unaffected.

### known issues:
- tall images, larger height than width, get turned 90 degrees before conversion - so they have to be rotated. Also, this means that image will now have a height of maximum: 1000.

# usage
- clone the repo
- in cli, `yarn install`, to install dependencies
- `yarn start directory_filepath`, replace directory filepath with the filepath of the directory (folder) containing your images. should look something like `/home/user/Desktop/images`, for example (varies with OS)

# Katapult Cartridge

## Setup environment

### Download and install dependencies

* In the same folder, clone the following projects:

  * [storefront-reference-architecture](https://github.com/SalesforceCommerceCloud/storefront-reference-architecture)
  * [storefrontdata](https://github.com/SalesforceCommerceCloud/storefrontdata)
  * [int-katapult](https://bitbucket.org/shoshkey/link_katapult/src/master/)
  * [build-suite](https://github.com/SalesforceCommerceCloud/build-suite)

* Install node (if not installed already)
* Run npm install in all the projects except storefrontdata
* Install sgmf-scripts globally `npm install -g sgmf-scripts`

### Use build suite for deployment

* Copy file `build/int-katapult.json` to `build-suite/build` folder and update connection params
* Within the build-suite folder - Run command to build code: `grunt build --project=int-katapult`
* Within the build-suite folder - Run command to deploy code: `grunt dist --project=int-katapult`
* Within the build-suite folder - Run command to import sites: `grunt importSite --project=int-katapult`
* Go to Business Manager and generate search indexes.

### Sync sandbox without build

* Inside this project folder, copy `dw.json.example` to `dw.json` and update connection parameters
* Run command: `npm run watch` to watch, compile and upload files to the sandbox
* Run command `npm run watch:compile` to watch and complie files (If you are using an editor like VS or Eclipse to upload changes)
* Have fun!

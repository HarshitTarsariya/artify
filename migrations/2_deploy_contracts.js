var Artify = artifacts.require("./Artify.sol");
var SimpleStorage = artifacts.require("./SimpleStorage.sol");
module.exports = function(deployer) {
  deployer.deploy(Artify);
  deployer.deploy(SimpleStorage);
};
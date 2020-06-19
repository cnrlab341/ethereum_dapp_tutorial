pragma solidity ^0.6.6;

contract Proof{

  struct File{
    uint timestamp;
    string owner;
  }

  mapping(string => File) files;

  event FileStatus(bool status, uint timestamp, string owner, string fileHash);

  function set(string  memory owner, string memory fileHash) public {
    if(files[fileHash].timestamp == 0){
      files[fileHash] = File(block.timestamp, owner);
      emit FileStatus(true, block.timestamp, owner, fileHash);
    } else {
    emit FileStatus(false, block.timestamp, owner, fileHash);
    }
  }

  function get(string memory fileHash) public view returns (uint timestamp, string memory owner){
    return (files[fileHash].timestamp, files[fileHash].owner);
  }
}

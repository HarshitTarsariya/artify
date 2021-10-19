// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21;

contract Artify{
    //Store Images
    mapping(uint=>Image) public images;
    uint public imageCount=0;

    struct Image{
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address payable author;
    }
    event ImageCreated(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );
    event ImageTipped(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );

    //Create Image
    function uploadImage(string memory _imgHash,string memory _description) public{
        //Valid data input
        require(bytes(_imgHash).length > 0);
        require(bytes(_description).length > 0);
        require(msg.sender != address(0x0));

        imageCount+=1;
        images[imageCount]=Image(imageCount,_imgHash,_description,0,msg.sender);

        //Emit Event
        emit ImageCreated(imageCount,_imgHash,_description,0,msg.sender);
    }

    //Tip Image
    function tipImageOwner(uint _id) public payable{
        //Check if ID is valid
        require(_id>0 && _id<=imageCount);

        Image memory _image=images[_id];
        address payable _author=_image.author;

        //Send the tip to author (msg.value is ether value from tipper)
        address(_author).transfer(msg.value);

        _image.tipAmount+=msg.value;
        //Back on Smart Contract from memory
        images[_id]=_image;
    }
}
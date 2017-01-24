
var readlineSync = require('readline-sync');
var menu = [
    'Show current folder',
    'Go to another folder and show contents',//move to another folder
    'Create file or folder',
    'Delete file or folder',
    'Open file',
    'Quit program'
];
var currentIndex = 0;
var index = 0;
var namesOfFolders = [];
var kids = [];
var currentSon= 0;
var itemExists= true;
var fsStorage = [

    [0, 0, 'root'],
    [1, 0, 'subfolder1'],
    [2, 0, 'subfolder2'],
    [3, 0, 'subfolder3'],
    [4, 0, 'subfolder4'],
    [5, 0, 'subfolder5'],
    [6, 5, 'file1', 'I am file 1 and my text is a bit boring'],
    [7, 5, 'file2', 'I have a crazy Vimeruner called Louis'],
];

function readMenu() {
    var answer = readlineSync.keyInSelect(menu, 'choose from menu\n');
    switch (answer) {
        case 0:           //see folder content
            showFileSystem(currentIndex);
            break;
        case 1:           //move to another folder
            // changeCurrentFolder(currentIndex);
            // break;
            showFileSystem(currentIndex);
            whereTo = readlineSync.question('where would you like to go?\n', answer)
            for(var x=0; x<fsStorage.length; x++){            //creates a temporary array of the folder names
                namesOfFolders.push(fsStorage[x][2]);
            }
            index = namesOfFolders.indexOf(whereTo);     //checks if such a name exists
            if (index == -1 && whereTo != '..')   {
                console.log('Sorry, no such file or folder');
                break;
            } else{
                // if(fsStorage[x].length == 3){
                //     console.log('Sorry, this is not a folder');}
                // else{
               findItem(whereTo);
               } showFileSystem(currentIndex);
              break;

        case 2:             //create file or folder
            createFileOrFolder(currentIndex);
            break;
        case 3:             //delete a file or folder
            deleteFileOrFolder(currentIndex);
            break;
        case 4:                //open a text file
            openFile(currentIndex);
            break;
        case 5:                //quit program
            quitProgram();
            break;
    }
    readMenu();         // presents menu again at the end of each action
}


function findItem(whereTo) {                                        //returns with a new index number
    if(whereTo <= 0){                                                   //empty string
        console.log('please enter folder to go to');
    } else{
        if (whereTo == '..') {                                           //going up
            if(fsStorage[currentIndex][2]=='root'){
                console.log('this is the root directory, cant go any higher');
            } else {                                                  //if not root directory
                currentIndex=fsStorage[currentIndex][1];            //whoever you are who is your father
              }
        } else{                                                       //going down
            for (var f = 0; f < fsStorage.length; f++) {
                if(whereTo == fsStorage[f][2] && currentIndex == fsStorage[f][1]
                    && fsStorage[f].length == 3){
                    // if(whereTo == fsStorage[f][2] && fsStorage[f].length == 3){
                    fileExists = 1;
                    currentIndex = fsStorage[f][0];
                    break;  }  }       //found you what is your index
            if(fileExists == 0)  {
                console.log('Woops... no such folder');
                //whereTo = readlineSync.question('would you like to try again?',answer)
                readMenu();
            }
        }
     }
}


function showFileSystem(currentIndex) {
    isFather(currentIndex);
    if(fsStorage[currentIndex].length == 4) {                //if folder
        console.log(fsStorage[currentIndex][2]);
     } else {
        console.log(fsStorage[currentIndex][2] + '/');      //writes currentIndex as root
        if (kids.length>0) {                                //check if he is somebody's father
          for (var x = 0; x < kids.length; x++) {
            currentSon = (kids[x]);                  //writes current Sons
            console.log("\t"+ currentSon);
          }
        }
      }
}


//function isFather checks for kids, marks their type, and put them in the kids array
function isFather(currentIndex) {
    kids.length=0;
    for (var x = 0; x < fsStorage.length; x++) {
        if (fsStorage[x][1] == currentIndex) {
            if (fsStorage[x][0]!= 0){
                if (fsStorage[x].length == 4) {
                    kids.push('#' + fsStorage[x][2]);
                } else {
                    kids.push(fsStorage[x][2] + '/');
                }
            }
        }
    } kids.sort();
}

function changeCurrentFolder(currentIndex) {
    showFileSystem(currentIndex);
    itemName = 'subfolder5';
      //  readlineSync.question('where would you like to go?\n');
    if (itemName == '..') {                                //going up
        if (fsStorage[currentIndex][0] == 0) {
            console.log('this is the root directory, you cant go any higher');
        } else {
             currentIndex = fsStorage[currentIndex][1];     //finds father
        }
    } else {                                               //going down
        for (var f = 0; f < fsStorage.length; f++) {
            if (itemName == fsStorage[f][2] && currentIndex == fsStorage[f][1]) {   // exists             currentIndex = fsStorage[f][0];
               currentIndex = fsStorage[f][0];
                break;
            }
        }
            if (fsStorage[currentIndex].length == 4) {
                console.log('Sorry, this is not a folder');
            } else {

            }
        }
    showFileSystem(currentIndex);
}

function createFileOrFolder(currentIndex){
    newItem = readlineSync.question('enter name of item to create? ');
    for(var x=0; x<fsStorage.length; x++){
        namesOfFolders.push(fsStorage[x][2]);
    }
    index = namesOfFolders.indexOf(newItem);     //checks if such a name exists
    if (index !=-1) {console.log('Sorry, this name is taken please choose another');
    }
    else{
        content = readlineSync.question('write your file content\n');
        if(content <=0 ) {
            fsStorage.push([fsStorage.length, currentIndex, newItem]);     //adds folder
        } else{
            fsStorage.push([fsStorage.length, currentIndex, newItem, content])  //adds file
          }
    }
    showFileSystem(currentIndex);
}

function deleteFileOrFolder() {
    showFileSystem(currentIndex);
    itemToDelete = readlineSync.question('enter name of item to Delete?\n');
    if (itemToDelete == 'root') {
        console.log('you cannot delete the root directory');
    } else {
        index = ifExists(itemToDelete);
        areYouSure = readlineSync.question('Are you sure? y/n\n');
        if (areYouSure == 'n') {
            console.log('action cancelled');
        } else {
            fsStorage.splice(index, 1);                //deletes the item in index location
            for (u = index; u < (fsStorage.length); u++) {     //updates array to avoid hole
                fsStorage[u][0] = u;
                if (fsStorage[u][1] != 0) {
                    fsStorage[u][1] = (fsStorage[u][1]) - 1;
                }
            }
        }
              console.log(itemToDelete, "has been deleted")
              showFileSystem(currentIndex);
         }
}

function openFile(currentItem) {
    showFileSystem(currentIndex);
    itemName = readlineSync.question('enter name of file to open?\n');
    for(var x=0; x<fsStorage.length; x++){
        namesOfFolders.push(fsStorage[x][2]);
        currentIndex = x;
    }
    index = namesOfFolders.indexOf(itemName);     //checks if such a name exists
    if (index == -1 || fsStorage[currentIndex].length == 3) {
        console.log('Sorry, no such file');
    } else {
        console.log(fsStorage[currentIndex][3]);
      }

}

function quitProgram() {
    process.exit(0);
}

function ifExists(itemName){
    namesOfFolders.length = 0;                     //resets temp array
    if (itemName <= 0) {                           //if empty
        console.log('did not catch the name please type again');
    } else {
        for(var x=0; x<fsStorage.length; x++){         //creates a temporary array of the folder names
            namesOfFolders.push(fsStorage[x][2]);
        }
        index = namesOfFolders.indexOf(itemName);    //checks if name exists
        if (index == -1) {
            console.log('Sorry, no such file or folder');

        } else{
            //currentIndex = index;
            return index;
          }
    }
}

readMenu();




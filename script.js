let thead = document.getElementById("thead-column");
let tbody = document.getElementById("tbody");
let column= 26;
let current;
let rows = 100;

let bold = document.getElementById("bold-btn");
let italic = document.getElementById("italic");
let underline= document.getElementById("underline");

let textColor = document.getElementById("text-color");
let bgColor = document.getElementById("bg-color");

let left = document.getElementById("align-left");
let center = document.getElementById("align-center");
let right = document.getElementById("align-right");

let fontSize = document.getElementById("font-size");
let fontStyle=document.getElementById("font-style");

let cut = document.getElementById("text-cut");
let copy= document.getElementById("text-copy");
let paste= document.getElementById("text-paste");

// let alphabets= [
//    "a","b","c","d"
// ]

// alphabets.forEach((alphabet)=>{
// let th = document.createElement("th");
// th.textContent=alphabet;
// thead.appendChild(th);
// })

for(let i=0;i<column;i++){
    let th = document.createElement("th");
    th.textContent=String.fromCharCode(i+65);
    thead.appendChild(th);
}


for(let row=0;row<rows;row++){
    let tr= document.createElement('tr');
    let th= document.createElement('th');
    th.textContent = row+1;
    tr.appendChild(th);

    for(let i=0;i<column;i++){
        let td = document.createElement("td");
        td.setAttribute("contentEditable","true");
        td.setAttribute("spellcheck","false");
        td.setAttribute("id",`${String.fromCharCode(i+65)}${row+1}`)
        
        td.addEventListener("focus", focused);
        td.addEventListener("input",onInput);
        tr.appendChild(td);
    }


    tbody.appendChild(tr);
}

//making arrayobject of empty object for each cell
let matrix = new Array(rows);
let numSheets =1;
let arrMatrix=[matrix];
let currSheetNum = 1;



for(let i=0;i<rows;i++){
    matrix[i]= new Array(column);
    for(let j=0;j<column;j++){
      matrix[i][j]={};
    }
}


//update data whenever we get it called

function updateJson(currCell){
    let json={
        text: currCell.innerText,
        style:currCell.style.cssText,
        id: currCell.id
    }
    let id = currCell.id.split("");
    let i=id[1]-1;
    let j=id[0].charCodeAt(0)-65;
    matrix[i][j]=json;
    console.log(matrix);

    
    // if(arrMatrix.length==counter){
    //    arrMatrix[counter-1]=matrix;
    // }
    // else{
    //     arrMatrix.push(matrix);
    // }
    
    console.log(arrMatrix);

}

document.getElementById("jsonFile").addEventListener("change",readJsonFile);

function readJsonFile(event){
const file = event.target.files[0];

if(file){
    const reader = new FileReader();

    reader.onload= function(e){
        const fileContent = e.target.result;

        //id style text
        //parse the Json file content and process the data
        try{
            const jsonData= JSON.parse(fileContent);
            console.log("matrix2",jsonData);
            matrix= jsonData;
            jsonData.forEach((row)=>{
                row.forEach((cell)=>{
                    if (cell.id){
                        var mycell= document.getElementById(cell.id);
                        mycell.innerText= cell.text;
                        mycell.style.cssText= cell.style;
                    }
                });
            });
        }catch(error){
            console.log("Error parsing JSON file",error);
        }
    };
    reader.readAsText(file);
} 
}

//downloadbutton

function downloadJson(){
    //Define your json Data

    //convert json data to string
    const jsonString = JSON.stringify(matrix);

    //create a Blob with the json data and set its MIME type to application/json
    const blob = new Blob([jsonString],{type:"application/json"});

    //create an anchor element and set its href attribute to the Blob URL
    const link = document.createElement("a");
    link.href= URL.createObjectURL(blob);
    link.download="data.json"; //set the desired file name

    //Append the link to the document, click it to start the download, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}




function focused(e){
console.log("in focus",e.target);
current= e.target;
document.getElementById("current-cell").innerText=e.target.id;
}

function onInput(e){
updateJson(e.target);

}

//fontWeightbold
bold.addEventListener("click",()=>{
if(current.style.fontWeight=="bold"){
    current.style.fontWeight="normal";
    
}
else{
    current.style.fontWeight="bold";
}
updateJson(current);

});

//fontStyleitalic
italic.addEventListener("click",()=>{
    if(current.style.fontStyle=="italic"){
        current.style.fontStyle="normal";
    }
    else{
        current.style.fontStyle="italic";
    }
    updateJson(current);
    });

    //textdecoration underline
    underline.addEventListener("click",()=>{
        if(current.style.textDecoration=="underline"){
            current.style.textDecoration="none";
        }
        else{
            current.style.textDecoration="underline";
        }
        updateJson(current);
     });

 //textcolor
textColor.addEventListener("input",()=>{
current.style.color= textColor.value;
updateJson(current);
});

//backgroundcolor
bgColor.addEventListener("input",()=>{
    current.style.backgroundColor= bgColor.value;
    updateJson(current);
 });

//  text aligns left center right
left.addEventListener("click",()=>{
    current.style.textAlign="left";
    updateJson(current);
})
center.addEventListener("click",()=>{
    current.style.textAlign="center";
    updateJson(current);
})
right.addEventListener("click",()=>{
    current.style.textAlign="right";
    updateJson(current);
})


//fontsize
fontSize.addEventListener("change",()=>{
    current.style.fontSize= fontSize.value;
    updateJson(current);
})


//fontstyle
fontStyle.addEventListener("change",()=>{
    current.style.fontFamily= fontStyle.value;
    updateJson(current);
})

//cut copy paste

cut.addEventListener("click",()=>{
    currentValue={
        style: current.style.cssText,
        text: current.innerText
    }
    updateJson(current);
    current.style=null;
    current.innerText=null;
})

copy.addEventListener("click",()=>{
    currentValue={
        style: current.style.cssText,
        text: current.innerText,
    }
    updateJson(current);
})

paste.addEventListener("click",()=>{
    current.style.cssText= currentValue.style;
    current.innerText= currentValue.text;
    updateJson(current); 
})

let addBtn = document.getElementById("add-btn");

addBtn.addEventListener("click", ()=>{
alert("adding new Sheet");

if(numSheets==1){
    let myArr= [matrix];
    localStorage.setItem("ArrMatrix",JSON.stringify(myArr));
}else{
    let localStorageArr= JSON.parse(localStorage.getItem("ArrMatrix"));
    let myArr=[...localStorageArr, matrix];
    localStorage.setItem("ArrMatrix",JSON.stringify(myArr));
}

numSheets++;
currSheetNum=numSheets;



for(let i=0;i<rows;i++){
    matrix[i]= new Array(column);
    for(let j=0;j<column;j++){
      matrix[i][j]={};
    }
}


tbody.innerHTML=``;
for(let row=0;row<rows;row++){
    let tr= document.createElement('tr');
    let th= document.createElement('th');
    th.textContent = row+1;
    tr.appendChild(th);

    for(let i=0;i<column;i++){
        let td = document.createElement("td");
        td.setAttribute("contentEditable","true");
        td.setAttribute("spellcheck","false");
        td.setAttribute("id",`${String.fromCharCode(i+65)}${row+1}`)
        
        td.addEventListener("focus", focused);
        td.addEventListener("input",onInput);
        tr.appendChild(td);
    }

    tbody.append(tr);
}
document.getElementById("sheet-num").innerHTML="Sheet"+ currSheetNum;

})

document.getElementById("sheet1").addEventListener("click", () => {
    var myArr = JSON.parse(localStorage.getItem("ArrMatrix"));
    let tableData = myArr[0];
    matrix = tableData;
    tableData.forEach((row) => {
      row.forEach((cell) => {
        if (cell.id) {
          var myCell = document.getElementById(cell.id);
          myCell.innerText = cell.text;
          myCell.style.cssText = cell.style;
        }
      });
    });
  });
  
document.getElementById("sheet2").addEventListener("click", () => {
    var myArr = JSON.parse(localStorage.getItem("ArrMatrix"));
    let tableData = myArr[1];
    matrix = tableData;
    tableData.forEach((row) => {
      row.forEach((cell) => {
        if (cell.id) {
          var myCell = document.getElementById(cell.id);
          myCell.innerText = cell.text;
          myCell.style.cssText = cell.style;
        }
      });
    });
  });

  document.getElementById("sheet3").addEventListener("click", () => {
    var myArr = JSON.parse(localStorage.getItem("ArrMatrix"));
    let tableData = myArr[2];
    matrix = tableData;
    tableData.forEach((row) => {
      row.forEach((cell) => {
        if (cell.id) {
          var myCell = document.getElementById(cell.id);
          myCell.innerText = cell.text;
          myCell.style.cssText = cell.style;
        }
      });
    });
  });
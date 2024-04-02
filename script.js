const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

// initially
let password="";
let passwordLength=10;
let checkCount=0;
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// set circle color to grey
setIndicator("#ccc");
handleSlider();

// set passwordLength
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow='0px 0px 12px 1px ${color}'; 
    // putulir chaya asheni check koro
}

function getrndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getrndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getrndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getrndInteger(65,91));
}

function generateSymbol(){
    const randNum=getrndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

// calculate strength of password
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) 
    {
      setIndicator("#0f0");
    } 
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6)
    {
      setIndicator("#ff0");
    } 
    else {
      setIndicator("#f00");
    }
}

// copy content
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText='copied';
    }
    catch(e){
        copyMsg.innerText='failed';
    }
    // to make copy span visible
    copyMsg.classList.add("active")

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000)
}

// shuffling password
function shufflePassword(array){
     //Fisher Yates Method
     for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// handling checkbox change
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })
    // special condition
    if (passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

// function on change of slider value
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

// function on change of slider value
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

// function on click of copy button
copyBtn.addEventListener('click',()=>{
    if (passwordDisplay.value){
        copyContent();
    }
})

// function on click generate button
generateBtn.addEventListener("click",()=>{
    // none of the checkbox are selected
    if(checkCount<=0) return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    //lets start thre journey to find new password
    console.log("Starting the Journey");
    
    // remove old password
    password='';

    // lets put the stuff mentioned by checkboxes

    let funcArr = [];
    if (uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked){
        funcArr.push(generateRandomNumber)
    }
    if (symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    // compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    console.log("COmpulsory adddition done");
    console.log(password)

    // remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex = getrndInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    

    // shuffle the password
    password=shufflePassword(Array.from(password));
    console.log("Shuffling done");

    // show in UI
    passwordDisplay.value=password
    console.log("UI adddition done");
    
    // calculate strength
    calcStrength();
})
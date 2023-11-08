

// Variables
let allowOperator = false;
let nextInputClears = false;
let nextNumClears = false;
let currentInput = "";
let inputArray = [];
let buttons = document.getElementsByTagName("button");
let numbers = ["00", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
let bgColorMem;
let operators = {
    "+": function (a, b) { return a + b },
    "-": function (a, b) { return a - b },
    "x": function (a, b) { return a * b },
    "\u00f7" /*Division*/: function (a, b) {
        if (b != 0) {
            return a / b
        }
        
        allowOperator = false;
        nextNumClears = true;
        return "undefined";
    }
}

// Helper function to set HTML of specified element
function setHTML(element, html) {
    document.getElementById(element).innerHTML = html;
}

// Updates the display
function updateDisplay() {
    setHTML("calDisplay", inputArray.join(" ") + " " + currentInput);
}

// Handles the appending of integers
function appendNum(num) {
    let numTooLong = false;
    if (currentInput.length >= 18) {
        numTooLong = true;
    }
    if (currentInput == "" && inputArray.length > 0 && allowOperator === true) {
        currentInput = inputArray.pop();
        currentInput += num;
    } else if (numTooLong === false) {
        currentInput += num;
    }

}

// Handles the appending of symbols to the input string
function appendOperator(sym) {
    if (currentInput != "") {
        inputArray.push(currentInput);
    }
    inputArray.push(sym);
    currentInput = "";
    allowOperator = false;
}

// Handles the appending of dots
function appendDot() {
    if (currentInput.indexOf(".") == -1) {
        currentInput += ".";
    }
}

// Appends the positive/negative symbol
function appendPosNeg() {
    if (Number.isInteger(parseInt(currentInput[0]))) {
        currentInput = "-" + currentInput;
    } else if (currentInput[0] == "-") {
        currentInput = currentInput.substr(1, currentInput.length);
    }
}

// Handles the deletion of user input
// If currentInput is not empty, delete rightmost character
// Else if currentInput is empty and inputArray is not empty, pop off of inputArray and then delete
function deleteInput() {
    let removedVal;
    function deleteVal() {
        removedVal = currentInput[currentInput.length - 1];
        currentInput = currentInput.substr(0, currentInput.length - 1);
    }
    if (currentInput != "") {
        deleteVal();
    } else if (currentInput == "" && inputArray.length > 0) {
        currentInput = inputArray.pop();
        deleteVal();
    }
    if (operators.hasOwnProperty(removedVal)) {
        allowOperator = true;
    }
}

// Preps the input array for calculation
function finalizeInputArray() {
    // Makes sure all values are stored in array
    if (currentInput != "") {
        inputArray.push(currentInput);
        currentInput = "";
    }
    // Removes an operator from the end of inputArray if the user left one there
    if (operators.hasOwnProperty(inputArray[inputArray.length - 1])) {
        inputArray.pop();
        allowOperator = true;
    }

    for (var i = 0; i < inputArray.length; i++) {
        if (!isNaN(parseFloat(inputArray[i]))) {
            inputArray[i] = parseFloat(inputArray[i]);
        }
    }
    console.log(inputArray);
}

function calcWith(op1, op2) {
    // Declare variables
    let op1Index;
    let op2Index;
    let indexToUse;
    let operator;
    let indexBefore;
    let indexAfter;
    let elemBefore;
    let elemAfter;

    // Function to reintialize variables
    function initVars() {
        op1Index = inputArray.indexOf(op1);
        op2Index = inputArray.indexOf(op2);
        switch (true) {
            case (op1Index == -1 && op2Index == -1):
                indexToUse = -1;
                break;
            case (op1Index == -1 && op2Index != -1):
                indexToUse = op2Index;
                operator = op2;
                break;
            case (op2Index == -1 && op1Index != -1):
                indexToUse = op1Index;
                operator = op1;
                break;
            case (op2Index < op1Index):
                indexToUse = op2Index;
                operator = op2;
                break;
            case (op1Index < op2Index):
                indexToUse = op1Index;
                operator = op1;
                break;
        }
        indexBefore = indexToUse - 1;
        indexAfter = indexToUse + 1;
        elemBefore = inputArray[indexBefore];
        elemAfter = inputArray[indexAfter];

    }

    initVars();

    while (indexToUse != -1) {
        console.log("Calculating with: " + elemBefore + operator + elemAfter);
        inputArray[indexToUse] = operators[operator](elemBefore, elemAfter);
        inputArray.splice(indexAfter, 1);
        inputArray.splice(indexBefore, 1);
        console.log("Result: " + inputArray);
        initVars();
    }
}

function finalizeOutput() {
    currentInput = inputArray[0].toString();
    inputArray.length = 0;
}

// Handles what happens on button clicks
function buttonPressed(userInput) {

    if (nextInputClears === true && numbers.includes(userInput)) {
        currentInput = "";
        inputArray.length = 0;
        nextInputClears = false;
    }

    switch (true) {
        // Is a number and the next number input does not clear the window
        case (numbers.includes(userInput)):
            appendNum(userInput);
            allowOperator = true;
            break;
        // Is an operator
        case (operators.hasOwnProperty(userInput) && allowOperator):
            appendOperator(userInput);
            nextInputClears = false;
            break;
        case (userInput == "."):

            appendDot();
            break;
        case (userInput == "+/-"):
            appendPosNeg();
            break;
        case (userInput == "C"):
            currentInput = "";
            inputArray = [];
            break;
        case (userInput == "DEL"):
            deleteInput();
            break;
        // Is the equals button and inputArray has content
        case (userInput == "=" && inputArray.length > 0):
            finalizeInputArray();
            calcWith("x", "\u00f7");
            calcWith("+", "-");
            finalizeOutput();
            nextInputClears = true;
            break;
    }
    updateDisplay();
}

// Adds an event listener for clicks to each element in buttons
// Assigns button pressed to userInput
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        let userInput = this.innerHTML;
        buttonPressed(userInput);
    });
}

// Sets button color with keyboard input
// Assigns keyboard input to buttons
function toggleKeyColor(key, action) {
    let theButton;
    let bgColor = "#74f790";
    switch (key) {
        case ("1"):
            theButton = "one-btn";
            break;
        case ("2"):
            theButton = "two-btn";
            break;
        case ("3"):
            theButton = "three-btnb";
            break;
        case ("4"):
            theButton = "four-btn";
            break;
        case ("5"):
            theButton = "five-btn";
            break;
        case ("6"):
            theButton = "six-btn";
            break;
        case ("7"):
            theButton = "seven-btn";
            break;
        case ("8"):
            theButton = "eight-btn";
            break;
        case ("9"):
            theButton = "nine-btn";
            break;
        case ("0"):
            theButton = "zero-btn";
            break;
        case ("Enter"):
            theButton = "equals-btn";
            bgColor = "#f0f0f0";
            break;
        case ("Backspace"):
            theButton = "del-btn";
            break;
        case ("-"):
            theButton = "minus-btn";
            break;
        case ("+"):
            theButton = "plus-btn";
            break;
        case ("*"):
            theButton = "times-btn";
            break;
        case ("/"):
            theButton = "divide-btn";
            break;
        case ("."):
            theButton = "dot-btn";
            break;
    }



}

// Adds an event listener to the window for keydown events
// Assigns the key input to userInput
window.addEventListener("keydown", function (event) {
    event.preventDefault();
    let userInput;
    switch (event.key) {
        default:
            userInput = event.key;
            break;
        case ("/"):
            userInput = "\u00f7";
            break;
        case ("*"):
            userInput = "x";
            break;
        case ("Enter"):
            userInput = "=";
            break;
        case ("Backspace"):
            userInput = "DEL";
            break;
    }
    event.preventDefault();
    toggleKeyColor(event.key, "keydown");
    buttonPressed(userInput);
});

window.addEventListener("keyup", function (event) {
    event.preventDefault();
    toggleKeyColor(event.key, "keyup");
    event.preventDefault();
});
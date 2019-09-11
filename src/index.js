// import sayHello from './hello';
// import './index.scss';
import HearingTestHandler from './HearingTestHandler'

let handler = new HearingTestHandler()

function startHearingTest () {
  handler.init()
}

function userInput () {
  handler.handleUserInput()
}

const onTestFinished = (evaluation) => {
  console.log('test finished', evaluation)
}

document.addEventListener('DOMContentLoaded', function(){

  document.getElementById('startBtn').addEventListener('click', startHearingTest)

  document.getElementById('userInput').addEventListener('click', userInput)

  handler.setOnHearingTestFinished = onTestFinished
}, false);



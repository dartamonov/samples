# Clock Tower Bell Counter. JavaScript ES6 class / Jest test.

### User Story
As a clock enthusiast, I want to know how many times a clock tower will ring its bell between two given times so that I can plan to sing along. 

### Background
A clock tower will ring its bell every hour, on the hour, a number of times equal to the number indicated by the hours hand.
##### Example
At 3pm, the clock tower will ring the bell three times. At midnight, it will ring the bell 12 times. 


### Technical Specification
Write a class with a method called "countBells" that will accept a start time and end time. Both times will be in twenty-four hour notation, such as 12:00 for noon and 15:30 for half-past three in the afternoon.
Your function should return a integer representing the number of times the clock tower will ring its bell between the two provided times.
##### Notes
* If either time is on the hour (ex. 14:00) then you should count the bell rings that would occur at that hour. 
* If both times are equal, treat it as if twenty-four hours will pass and not that the two times are the same time on the same day.


### Test Cases
* INPUT $startTime = '2:00'; $endTime = '3:00'; OUTPUT 5 
* INPUT $startTime = '14:00'; $endTime = '15:00'; OUTPUT 5 
* INPUT $startTime = '14:23'; $endTime = '15:42'; OUTPUT 3 
* INPUT $startTime = '23:00'; $endTime = '1:00'; OUTPUT 24

### Demo
```
npm install
npm test
```

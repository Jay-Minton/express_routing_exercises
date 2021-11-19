const express = require('express');

const app = express();
//might need ./ on express
const ExpressError = require('./expressError');

app.get("/mean", (req, res) => {
    if (!req.query.nums) {
        throw new ExpressError('You must pass a query of nums seperated by commas.', 400)
    }

    let nums = convertNums(req.query.nums.split(","));
    if (nums instanceof Error) {
        throw new ExpressError(nums.message);
    };

    result = 0;
    for (let i = 0; i < nums.length; i++) {
        result += nums[i];
    }
    result = result/nums.length;
    jResult = {
        "operation" : "mean",
        "value" : result
    }
    res.json(jResult);
})

app.get("/median", (req, res) => {
    if (!req.query.nums) {
        throw new ExpressError('You must pass a query of nums seperated by commas.', 400)
    }

    let nums = convertNums(req.query.nums.split(","));
    if (nums instanceof Error) {
        throw new ExpressError(nums.message);
    };
    middle = Math.floor(nums.length / 2);
    let result = 0;

    if(nums.length % 2 == 0) {
        result = (nums[middle] + nums[middle-1]) / 2
    } else {
        result = nums[middle];
    }
    jResult = {
        "operation" : "median",
        "value" : result
    }
    res.json(jResult);
})

app.get("/mode", (req, res) => {
    if (!req.query.nums) {
        throw new ExpressError('You must pass a query of nums seperated by commas.', 400)
    }
    
    let nums = convertNums(req.query.nums.split(","));
    if (nums instanceof Error) {
        throw new ExpressError(nums.message);
    };
    let freqCounter = createFrequencyCounter(nums);

    let count = 0;
    let mostFrequent;

  for (let key in freqCounter) {
    if (freqCounter[key] > count) {
      mostFrequent = key;
      count = freqCounter[key];
    }
  }


    jResult = {
        "operation" : "mode",
        "value" : mostFrequent
    }
    res.json(jResult);
})


function convertNums(nums) {
    let results = [];

    for (let i = 0; i < nums.length; i++) {
        val = Number(nums[i]);
        if(Number.isNaN(val)) {
            return new Error(
                `The value ${val} at index ${i} is not a valid number.` 
            );
        }
        results.push(val);
    }
    return results;
}

function createFrequencyCounter(nums) {
    return nums.reduce(function(acc, next) {
      acc[next] = (acc[next] || 0) + 1;
      return acc;
    }, {});
  }


app.use(function (req, res, next) {
    const err = new ExpressError("Not Found",404);
  
    return next(err);
});
   
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
  
    return res.json({
      error: err,
      message: err.message
    });
});
  

app.listen(3000, function() {
    console.log('App on port 3000');
})



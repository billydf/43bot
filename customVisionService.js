'use strict';

const request = require('request-promise').defaults({ encoding: null });

module.exports = {
    predict: predict
}

function predict(stream) {
    const options = {
        method: 'POST',
        url: 'https://southeastasia.api.cognitive.microsoft.com/customvision/v3.0/Prediction/1de794a6-1d4d-44ed-a211-7b7c5ef79567/classify/iterations/Iteration1/image',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Prediction-Key': '7e9907e0dbc84992bf67410efea8bdb1'
        },
        body: stream
    };

    return request(options);
}

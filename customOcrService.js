'use strict';

const request = require('request-promise').defaults({ encoding: null });

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = '4a77c91f95674d38828a08a55a21a808';

// Request parameters.
const params = {
    'language': 'unk',
    'detectOrientation': 'true',
};

module.exports = {
    predictOcr: predictOcr
}

function predictOcr(stream) {
    const options = {
        method: 'POST',
        qs: params,
        url: 'https://botcomputervision.cognitiveservices.azure.com//vision/v2.0/ocr',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key' : subscriptionKey
        },
        body: stream
    };

    return request(options);
}

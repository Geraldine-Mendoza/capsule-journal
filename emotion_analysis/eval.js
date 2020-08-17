const exec = require('child_process').exec
const { stderr } = require('process')
const Emotion = {"HAPPY":1, "SAD":2, "CONFUSED":3, "ANGRY":4, "EXCITED":5, "BORED":6, "SCARED":7, "NONE":8}; // enum ish

function cleanText(text) {
    // remove all shell metacharacters
}

module.exports = function(entryText) {
    // use "" around entryText?
    // ensure entry Text is safe !!!

    return new Promise((resolve, reject) => {
        exec("python-env/bin/python emotion_analysis/getEmotion.py --text \"" + entryText + "\"",
        // callback of exec, will resolve promise
        (err, stdout, stderr) => {
            if(err || stderr) resolve("error resolving emotion with error " + err); // TODO: should do something here eh
            const em = stdout.replace('\n','');
            console.log(`setting emotion to be ${em}`);
            switch(em) {
                case "Happy": resolve(Emotion.HAPPY);
                case "Angry": resolve(Emotion.ANGRY);
                case "Bored": resolve(Emotion.BORED);
                case "Excited": resolve(Emotion.EXCITED);
                case "Fear": resolve(Emotion.SCARED);
                case "Sad": resolve(Emotion.SAD);
                default: resolve(Emotion.NONE);
            }
        });
    });
}
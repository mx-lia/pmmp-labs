let streaming = false;

const video = document.getElementById('videoInput');

let startAndStopVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
            streaming = !streaming;
        })
        .catch(function (err) {
            console.log("An error occurred! " + err);
        });

    setTimeout(processSobelVideo, 0);
    setTimeout(processLaplasVideo, 0);
    setTimeout(processCannyVideo, 0);
};

let processSobelVideo = () => {
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);

    const FPS = 30;

    let begin = Date.now();
    cap.read(src);
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
    //cv.Sobel(src, dsty, cv.CV_8U, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
    cv.Sobel(src, dst, cv.CV_8U, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
    cv.imshow('sobelOutput', dst);
    let delay = 1000 / FPS - (Date.now() - begin);

    setTimeout(processSobelVideo, delay);
};

let processLaplasVideo = () => {
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);

    const FPS = 30;

    let begin = Date.now();
    cap.read(src);
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
    cv.Laplacian(src, dst, cv.CV_8U, 1, 1, 0, cv.BORDER_DEFAULT);
    cv.imshow('laplasOutput', dst);
    let delay = 1000 / FPS - (Date.now() - begin);

    setTimeout(processLaplasVideo, delay);
};

let processCannyVideo = () => {
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);

    const FPS = 30;

    let begin = Date.now();
    cap.read(src);
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
    cv.Canny(src, dst, 50, 100, 3, false);
    cv.imshow('cannyOutput', dst);
    let delay = 1000 / FPS - (Date.now() - begin);

    setTimeout(processCannyVideo, delay);
};
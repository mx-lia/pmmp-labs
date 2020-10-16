let imgInput = document.getElementById("imageInput");
let fileInput = document.getElementById("fileInput");
let funcSelect = document.getElementById("functionSelect");

fileInput.addEventListener("change", (e) => {
    imgInput.src = URL.createObjectURL(e.target.files[0]);
});

let exec = () => {
    let selected = funcSelect.options[funcSelect.selectedIndex].value;
    if (selected === "0" || !imgInput.src) {
        alert("Enter valid data");
        return;
    }

    let src = cv.imread(imgInput);
    let dst = new cv.Mat();
    let anchor = new cv.Point(-1, -1);
    let ksize = new cv.Size(3, 3);

    switch (selected) {
        case "1":
            {
                cv.filter2D(src, dst, cv.CV_8U, cv.Mat.eye(3, 3, cv.CV_32FC1), anchor, 0, cv.BORDER_DEFAULT);
            }
            break;
        case "2":
            {
                cv.blur(src, dst, ksize, anchor, cv.BORDER_DEFAULT);
            }
            break;
        case "3":
            {
                cv.boxFilter(src, dst, -1, ksize, anchor, true, cv.BORDER_DEFAULT);
            }
            break;
        case "4":
            {
                cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
            }
            break;
        case "5":
            {
                cv.medianBlur(src, dst, 5);
            }
            break;
        case "6":
            {
                cv.cvtColor(src, src, cv.COLOR_RGB2GRAY);
                cv.threshold(src, src, 129, 255, 0);
                cv.erode(src, dst, cv.Mat.ones(5, 5, cv.CV_8U), anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
            }
            break;
        case "7":
            {
                cv.cvtColor(src, src, cv.COLOR_RGB2GRAY);
                cv.threshold(src, src, 129, 255, 0);
                cv.dilate(src, dst, cv.Mat.ones(5, 5, cv.CV_8U), anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
            }
            break;
        case "8":
            {
                cv.blur(src, src, ksize, anchor, cv.BORDER_DEFAULT);
                cv.cvtColor(src, src, cv.COLOR_RGB2GRAY);
                cv.Canny(src, dst, 50, 100, 3, false);
            }
            break;
        case "9":
            {
                cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
                let srcVec = new cv.MatVector();
                srcVec.push_back(src);
                let accumulate = false;
                let channels = [0];
                let histSize = [256];
                let ranges = [0, 255];
                let hist = new cv.Mat();
                let mask = new cv.Mat();
                let color = new cv.Scalar(255, 255, 255);
                let scale = 2;
                cv.calcHist(srcVec, channels, mask, hist, histSize, ranges, accumulate);
                let result = cv.minMaxLoc(hist, mask);
                let max = result.maxVal;
                dst = new cv.Mat.zeros(src.rows, histSize[0] * scale, cv.CV_8UC3);
                for (let i = 0; i < histSize[0]; i++) {
                    let binVal = hist.data32F[i] * src.rows / max;
                    let point1 = new cv.Point(i * scale, src.rows - 1);
                    let point2 = new cv.Point((i + 1) * scale - 1, src.rows - binVal);
                    cv.rectangle(dst, point1, point2, color, cv.FILLED);
                }
                srcVec.delete(); mask.delete(); hist.delete();
            }
            break;
        case "10":
            {
                cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
                cv.equalizeHist(src, dst);
            }
            break;

    }
    cv.imshow('canvasOutput', dst);
    src.delete(); dst.delete();
};
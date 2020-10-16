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
                let thresh = 200;
                let blockSize = 2;
                let apertureSize = 3;
                let k = 0.04
                cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
                cv.cornerHarris(src, dst, blockSize, apertureSize, k, cv.BORDER_DEFAULT);
                cv.normalize(dst, dst, 0, 255, 32, cv.CV_32FC1, new cv.Mat());
                cv.convertScaleAbs(dst, dst, 1, 0);
                for (let j = 0; j < dst.rows; j++) {
                    for (let i = 0; i < dst.cols; i++) {
                        if (dst.data[j][i] > thresh) {
                            let color = new cv.Scalar(0);
                            cv.circle(dst, [i, j], 5, color, 2, 8, 0);
                            color.delete();
                        }
                    }
                }
            }
            break;
        case "2":
            {
                let corners = new cv.Mat();
                cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
                cv.goodFeaturesToTrack(dst, corners, 25, 0.01, 10);
                for (let i = 0; i < corners.rows; i++) {
                    let [x, y] = [corners.floatAt(i, 0), corners.floatAt(i, 1)];
                    cv.circle(dst, new cv.Point(x, y), 3, [255, 0, 0, 255], -1);
                }
            }
            break;
        case "3":
            {
                let srcTri = cv.matFromArray(3, 1, cv.CV_32FC2, [2,364,364,1564,609, 244]);
                let dstTri = cv.matFromArray(3, 1, cv.CV_32FC2, [0,0,610,0,0,200]);
                let dsize = new cv.Size(src.rows, src.cols);
                let M = cv.getAffineTransform(srcTri, dstTri);
                cv.warpAffine(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
            }
            break;
        case "4":
            {
                let dsize = new cv.Size(src.rows, src.cols);
                let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [195,9,417,126,50,368,530,780]);
                let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0,0,420,0,0,592,420,592]);
                let M = cv.getPerspectiveTransform(srcTri, dstTri);
                cv.warpPerspective(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
            }
            break;

    }
    cv.imshow('canvasOutput', dst);
    src.delete(); dst.delete();
};
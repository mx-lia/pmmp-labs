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
    let dst = cv.Mat.zeros(src.cols, src.rows, cv.CV_8UC3);

    switch (selected) {
        case "1":
            {
                cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
                cv.threshold(src, src, 120, 200, cv.THRESH_BINARY);
                let contours = new cv.MatVector();
                let hierarchy = new cv.Mat();
                cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
                for (let i = 0; i < contours.size(); ++i) {
                    let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255));
                    cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
                }
            }
            break;
        case "2":
            {
                let lines = new cv.Mat();
                cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
                cv.Canny(src, src, 50, 200, 3);
                cv.HoughLines(src, lines, 1, Math.PI / 180, 30, 0, 0, 0, Math.PI);
                for (let i = 0; i < lines.rows; ++i) {
                    let rho = lines.data32F[i * 2];
                    let theta = lines.data32F[i * 2 + 1];
                    let a = Math.cos(theta);
                    let b = Math.sin(theta);
                    let x0 = a * rho;
                    let y0 = b * rho;
                    let startPoint = { x: x0 - 1000 * b, y: y0 + 1000 * a };
                    let endPoint = { x: x0 + 1000 * b, y: y0 - 1000 * a };
                    cv.line(dst, startPoint, endPoint, [255, 0, 0, 255]);
                }
            }
            break;
        case "3":
            {
                let circles = new cv.Mat();
                let color = new cv.Scalar(255, 0, 0);
                cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
                cv.HoughCircles(src, circles, cv.HOUGH_GRADIENT, 1, 45, 75, 40, 0, 0);
                for (let i = 0; i < circles.cols; ++i) {
                    let x = circles.data32F[i * 3];
                    let y = circles.data32F[i * 3 + 1];
                    let radius = circles.data32F[i * 3 + 2];
                    let center = new cv.Point(x, y);
                    cv.circle(dst, center, radius, color);
                }
            }
            break;
    }
    cv.imshow('canvasOutput', dst);
    src.delete(); dst.delete();
};
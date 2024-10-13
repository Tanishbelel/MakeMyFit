from flask import Flask, render_template, Response
import cv2
import os
import cvzone
from cvzone.PoseModule import PoseDetector

app = Flask(__name__)

# Initialize video capture and pose detector
cap = cv2.VideoCapture(0)
detector = PoseDetector()

shirtFolderPath = "Resources/Shirts"
listShirts = os.listdir(shirtFolderPath)

fixedShirtWidth = 262
shirtRatioHeightWidth = 581 / 440
imageNumber = 0

@app.route('/')
def index():
    return render_template('index.html')

def generate_frames():
    global imageNumber
    while True:
        success, img = cap.read()
        if not success:
            break
        
        img = detector.findPose(img)
        lmList, bboxInfo = detector.findPosition(img, bboxWithHands=False, draw=False)

        if lmList:
            lm11 = lmList[11][1:3]  
            lm12 = lmList[12][1:3]  
            
            imgShirt = cv2.imread(os.path.join(shirtFolderPath, listShirts[imageNumber]), cv2.IMREAD_UNCHANGED)
            imgShirt = cv2.resize(imgShirt, (fixedShirtWidth, int(fixedShirtWidth * shirtRatioHeightWidth)))
            shirtX = int((lm11[0] + lm12[0]) / 2 - (fixedShirtWidth / 2))
            shirtY = int(lm11[1] + 10)
            img = cvzone.overlayPNG(img, imgShirt, (shirtX, shirtY))

        
        ret, buffer = cv2.imencode('.jpg', img)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)

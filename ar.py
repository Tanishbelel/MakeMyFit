import os
import cvzone
import cv2
from cvzone.PoseModule import PoseDetector


cap = cv2.VideoCapture(0) 
detector = PoseDetector()


shirtFolderPath = "Resources/Shirts"
listShirts = os.listdir(shirtFolderPath)


fixedShirtWidth = 262 
shirtRatioHeightWidth = 581 / 440
imageNumber = 0


imgButtonRight = cv2.imread("Resources/button.png", cv2.IMREAD_UNCHANGED)
imgButtonLeft = cv2.flip(imgButtonRight, 1)
counterRight = 0
counterLeft = 0
selectionSpeed = 10

while True:
    success, img = cap.read()
    if not success:
        print("Error: Couldn't read video file.")
        break

    img = detector.findPose(img)
    lmList, bboxInfo = detector.findPosition(img, bboxWithHands=False, draw=False)

    if lmList:
        # Get coordinates for left and right shoulders
        lm11 = lmList[11][1:3]  # Left shoulder
        lm12 = lmList[12][1:3]  # Right shoulder

        # Load the current shirt image
        imgShirt = cv2.imread(os.path.join(shirtFolderPath, listShirts[imageNumber]), cv2.IMREAD_UNCHANGED)
        
        # Resize the shirt image
        imgShirt = cv2.resize(imgShirt, (fixedShirtWidth, int(fixedShirtWidth * shirtRatioHeightWidth)))

        # Calculate the position for overlaying the shirt
        shirtX = int((lm11[0] + lm12[0]) / 2 - (fixedShirtWidth / 2))  # Centered between shoulders
        shirtY = int(lm11[1] + 10)  # Position slightly below the shoulders

        try:
            img = cvzone.overlayPNG(img, imgShirt, (shirtX, shirtY))
        except Exception as e:
            print(f"Error overlaying shirt: {e}")

        # Overlay buttons
        img = cvzone.overlayPNG(img, imgButtonRight, (1074, 293))
        img = cvzone.overlayPNG(img, imgButtonLeft, (72, 293))

        # Button interactions for changing shirts
        if lmList[16][1] < 300:  # Right hand gesture
            counterRight += 1
            cv2.ellipse(img, (139, 360), (66, 66), 0, 0, counterRight * selectionSpeed, (0, 255, 0), 20)
            if counterRight * selectionSpeed > 360:
                counterRight = 0
                if imageNumber < len(listShirts) - 1:
                    imageNumber += 1
        elif lmList[15][1] > 900:  # Left hand gesture
            counterLeft += 1
            cv2.ellipse(img, (1138, 360), (66, 66), 0, 0, counterLeft * selectionSpeed, (0, 255, 0), 20)
            if counterLeft * selectionSpeed > 360:
                counterLeft = 0
                if imageNumber > 0:
                    imageNumber -= 1
        else:
            counterRight = 0
            counterLeft = 0

    cv2.imshow("Image", img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

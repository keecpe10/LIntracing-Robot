
/**
  * Enumeration of ReadADC.
  */
enum LineRobotReadADC {
    //% block="ADC 0"
    ADC0 = 132,
    //% block="ADC 1"
    ADC1 = 196,
    //% block="ADC 2"
    ADC2 = 148,
    //% block="ADC 3"
    ADC3 = 212,
    //% block="ADC 4"
    ADC4 = 164,
    //% block="ADC 5"
    ADC5 = 228,
    //% block="ADC 6"
    ADC6 = 180,
    //% block="ADC 7"
    ADC7 = 244
}

enum LineRobotButton {
    //% block="A"
    A,
    //% block="B"
    B
}

enum LineRobotLineColor {
    //% block="ดำ"
    black,
    //% block="ขาว"
    white
}

enum LineRobotDirec {
    //% block="ซ้าย"
    Left,
    //% block="ขวา"
    Right
}

enum LineRobotTurnDirec {
    //% block="ซ้าย"
    Left,
    //% block="ขวา"
    Right
}

enum LineRobotCrossDirec {
    //% block="สี่แยก"
    CrossWay,
    //% block="สามแยกตัว T"
    CrossThree,
    //% block="สามแยกทางซ้าย"
    CrossLeft,
    //% block="สามแยกทางขวา"
    CrossRight
}


/**
  * Enumeration of Servo.
  */
enum LineRobotServo {
    //% block="1"
    SV1,
    //% block="2"
    SV2
}

/**
  * Enumeration of Servo.
  */
enum LineRobotServoUpDown {
    //% block="ยก"
    Up,
    //% block="วาง"
    Down
}


/**
  * Enumeration of Servo.
  */
enum LineRobotServoKeeper {
    //% block="ยก"
    Up,
    //% block="วาง"
    Down,
    //% block="จับ"
    Keep,
    //% block="ปล่อย"
    Leave
}


/**
  * Enumeration of Servo.
  */
enum LineRobotServoKeepLeave {
    //% block="จับ"
    Keep,
    //% block="ปล่อย"
    Leave
}


/**
 * Custom blocks /f23c monster /f2d6 นักบินอวกาศ /f2dd
 */
//% weight=100 color=#000000 icon="\uf23c"
namespace LineRobot {

    let sensorsRead: number[] = []
    let valSensorsMin: number[] = []
    let valSensorsMax: number[] = []
    let Sensors: LineRobotReadADC[] = [LineRobotReadADC.ADC0, LineRobotReadADC.ADC1, LineRobotReadADC.ADC2, LineRobotReadADC.ADC3, LineRobotReadADC.ADC4, LineRobotReadADC.ADC5, LineRobotReadADC.ADC6, LineRobotReadADC.ADC7]
    let numSensors = 0
    let error = 0
    let lastError = 0
    let last_positionValue = 0
    let state = false
    let last_state = false

    let state_right = false
    let last_state_right = false

    let state_left = false
    let last_state_left = false

    let ValCrossLeft = 150
    let ValCrossCenter = 600
    let ValCrossRight = 150

    let lineBlack = false
    let lineWhite = false

    let lineClr_isWhite = false


    let sensorsCrossRead: number[] = []
    let valSensorsCrossMin: number[] = []
    let valSensorsCrossMax: number[] = []

    let speedTurn = 0;

    let midSSL0 = 0
    let midSSL1 = 0
    let midSSC = 0
    let midSSR = 0


    /**ตั้งค่าเริ่มต้น สีเส้น จำนวนเซนเซอร์ ความเร็วเข้าเส้น  
  * @param NSensors percent of maximum NSensors, eg: 5
  */
    //% blockId="LineRobot_ตั้งค่า" block="ตั้งค่า สีเส้น %lineColor | จำนวนเซ็นเซอร์ %NSensors | ความเร็วเข้าเส้น %speedInLine"
    //% NSensors.min=1 NSensors.max=8
    //% speedInLine.min=0 NSensors.max=1000
    //% weight=100
    export function ตั้งค่า(lineColor: LineRobotLineColor, NSensors: number, speedInLine: number): void {
        numSensors = NSensors
        speedTurn = speedInLine

        if (lineColor == LineRobotLineColor.white){
            lineClr_isWhite = true
        }else{
            lineClr_isWhite = false
        }
            

        for (let n = 0; n < numSensors; n++) {
            valSensorsMin[n] = 4095
            valSensorsMax[n] = 0
        }
        for (let n = 0; n < 2; n++) {
            valSensorsCrossMin[n] = 1024
            valSensorsCrossMax[n] = 0
        }
    }

    /**ตั้งค่าเริ่มต้น จำนวนเซนเซอร์  
      * @param NSensors percent of maximum NSensors, eg: 5
      */
    //% blockId="LineRobot_ตั้งค่าเก่า" block="ตั้งค่า | จำนวนเซ็นเซอร์ %NSensors"
    //% NSensors.min=1 NSensors.max=8
    //% weight=100
    function ตั้งค่าเก่า(NSensors: number): void {
        numSensors = NSensors
        for (let n = 0; n < numSensors; n++) {
            valSensorsMin[n] = 4095
            valSensorsMax[n] = 0
        }
        for (let n = 0; n < 2; n++) {
            valSensorsCrossMin[n] = 1024
            valSensorsCrossMax[n] = 0
        }
    }

    /**ตั้งค่าเริ่มต้น จำนวนเซนเซอร์  
     */
    //% blockId="LineRobot_ตั้งค่าเซ็นเซอร์เส้นตัด" block="ตั้งค่าเซ็นเซอร์เส้นตัด | เซ็นเซอร์ซ้าย %valSensorLeft | เซ็นเซอร์ขวา %valSensorRight"
    //% NSensors.min=1 NSensors.max=8
    //% weight=100
    function ตั้งค่าเซ็นเซอร์เส้นตัด(valSensorLeft: number, valSensorRight: number): void {
        //ValCrossLeft = valSensorLeft
        //ValCrossRight = valSensorRight
    }

    /**ตั้งค่าความเร็วตอนเลี้ยว  
     */
    //% blockId="LineRobot_ตั้งค่าความเร็วเข้าโค้ง" block="ตั้งค่าความเร็วเข้าโค้ง |%valSensorLeft"
    //% NSensors.min=1 NSensors.max=8
    //% weight=100
    function ตั้งค่าความเร็วเข้าโค้ง(speed_turn: number): void {
        speedTurn = speed_turn
    }

    //% blockId="LineRobot_เปรียบเทียบค่าเซ็นเซอร์" block="เปรียบเทียบค่าเซ็นเซอร์"
    //% weight=99
    export function เปรียบเทียบค่าเซ็นเซอร์(): void {
        for (let i = 0; i < 150; i++) {
            caribrateSensors()
            caribrateCrossSensors()
            basic.pause(25)
        }

        ValCrossLeft = (valSensorsCrossMax[1] - valSensorsCrossMin[1]) / 2
        ValCrossRight = (valSensorsCrossMax[0] - valSensorsCrossMin[0]) / 2
        
        //หาค่ากลางของ ss
        midSSL0 = (valSensorsMax[0] + valSensorsMin[0]) / 2
        midSSL1 = (valSensorsMax[1] + valSensorsMin[1]) / 2
        midSSC = (valSensorsMax[3] + valSensorsMin[3]) / 2
        midSSR = (valSensorsMax[6] + valSensorsMin[6]) / 2
        
        basic.pause(100)
    }

    //% blockId="LineRobot_อ่านค่าเซ็นเซอร์เส้นตัด" block="อ่านค่าเซ็นเซอร์เส้นตัด"
    //% weight=85
    //% inlineInputMode=inline
    function อ่านค่าเซ็นเซอร์เส้นตัด(): void {
        // serial.writeNumber(pins.analogReadPin(AnalogPin.P0))
        // serial.writeString(" : ")
        // serial.writeNumber(pins.analogReadPin(AnalogPin.P1))
        // serial.writeLine("")
        //basic.showString("P0=" + pins.analogReadPin(AnalogPin.P0) + " : P1=" + pins.analogReadPin(AnalogPin.P1))
        //basic.showString(LineRobotReadADC.ADC0 + " : " + LineRobotReadADC.ADC0)
        basic.showString("R:" + ValCrossRight + " L:" + ValCrossLeft)
    }

    //% blockId="LineRobot_อ่านค่าเซ็นเซอร์" block="อ่านค่าเซ็นเซอร์"
    //% weight=85
    //% inlineInputMode=inline
    export function อ่านค่าเซ็นเซอร์(): void {

        /*serial.writeNumber(ReadADC(Sensors[0]))
        serial.writeString(" : ")
        serial.writeNumber(ReadADC(Sensors[3]))
        serial.writeString(" : ")
        serial.writeNumber(ReadADC(Sensors[6]))
        serial.writeLine("")*/

        serial.writeNumber(valSensorsMax[0])
        serial.writeString(" : ")
        serial.writeNumber(valSensorsMin[0])
        //serial.writeString(" : ")
        //serial.writeNumber(ReadADC(Sensors[6]))
        serial.writeLine("")
        
        

    }


    /**วิ่งตามเส้นแล้วเจอเส้นตัด 
      * @param speed percent of maximum speed, eg: 800
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=LineRobot_วิ่งตามเส้นแล้วเจอเส้นตัด block="วิ่งตามเส้นแล้วเจอเส้นตัด ด้วยความเร็ว %speed|KP %kp|KD %kd |ความเร็วแตะเส้น %speed_jc"
    //% speed.min=0 speed.max=800
    //% inlineInputMode=inline
    export function วิ่งตามเส้นแล้วเจอเส้นตัด(speed: number, kp: number, kd: number, speed_jc: number): void {
        JC(speed, kp, kd, speed_jc)
        //while (pins.analogReadPin(AnalogPin.P0) < ValCrossLeft && pins.analogReadPin(AnalogPin.P1) < ValCrossRight){
        //    track_line(200, kp, kd)
        //}
        หยุดมอเตอร์_เป็นเวลา(10)
    }
    function JC(speed: number, kp: number, kd: number, speed_jc: number): void {
        while (getJC() == 0) {
            track_line(speed, kp, kd)
        }
        หยุดมอเตอร์_เป็นเวลา(10)
        while (pins.analogReadPin(AnalogPin.P0) < ValCrossLeft && pins.analogReadPin(AnalogPin.P1) < ValCrossRight) {
            track_line(speed_jc, kp, kd)
        }
        หยุดมอเตอร์_เป็นเวลา(10)
    }
    function getJC(): number {
        if (ReadADC(Sensors[0]) > midSSL0 && ReadADC(Sensors[3]) > midSSC && ReadADC(Sensors[6]) > midSSR) {
            state = true
        } else {
            state = false
            last_state = false
        }
        if (last_state != state) {
            last_state = state
            return 1
        }
        else {
            return 0
        }
    }

    /** หยุดมอเตอร์ มอเตอร์1,มอเตอร์2   
      */
    //% blockId="LineRobot_หยุดมอเตอร์_เป็นเวลา" block="หยุดมอเตอร์ เป็นเวลา %times ms"
    //% weight=50
    export function หยุดมอเตอร์_เป็นเวลา(times: number): void {
        let previousMillis = input.runningTime()
        while (input.runningTime() - previousMillis < times) {
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.analogWritePin(AnalogPin.P14, 0)
            pins.digitalWritePin(DigitalPin.P15, 1)
            pins.analogWritePin(AnalogPin.P16, 0)
        }
    }


    /**เลี้ยว
      * @param speed percent of maximum speed, eg: 800
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=LineRobot_เลี้ยว_spin block="เลี้ยวสปินทาง %LineRobotTurnDirec| ด้วยความเร็ว %speed"
    //% speed.min=0 speed.max=800
    //% inlineInputMode=inline
    export function เลี้ยวสปิน(direc: LineRobotTurnDirec, speed: number): void {
        
        if (direc == LineRobotTurnDirec.Left) {
            หยุดมอเตอร์_เป็นเวลา(10)
            set_motors(speed, -speed)
            //basic.pause(100)
            readSensors()
            while (sensorsRead[0] < midSSL0) {
                readSensors()                
            }
            //set_motors(-speed, speed)
            //basic.pause(500)
            หยุดมอเตอร์_เป็นเวลา(10)
        }

        if (direc == LineRobotTurnDirec.Right) {
            หยุดมอเตอร์_เป็นเวลา(10)
            set_motors(-speed, speed)
            //basic.pause(100)
            readSensors()
            while (sensorsRead[6] < midSSR) {
                readSensors()
            }
            //set_motors(-speed, speed)
            //basic.pause(500)
            หยุดมอเตอร์_เป็นเวลา(10)
        }
        
    }


    /**วิ่งตามเส้นตลอด
      * @param speed percent of maximum speed, eg: 800
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=LineRobot_วิ่งตามเส้นตลอด block="วิ่งตามเส้นตลอด ด้วยความเร็ว %speed|KP %kp|KD %kd"
    //% speed.min=0 speed.max=800
    //% inlineInputMode=inline
    export function วิ่งตามเส้นตลอด(speed: number, kp: number, kd: number): void {
        while (true) {
            track_line(speed, kp, kd)
        }
    }

    /**วิ่งตามเส้นตามเวลาที่กำหนด 
      * @param speed percent of maximum speed, eg: 800
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=LineRobot_วิ่งตามเส้น block="วิ่งตามเส้น ด้วยความเร็ว %speed|เป็นเวลา %time|(ms) KP %kp|KD %kd"
    //% speed.min=0 speed.max=800
    //% inlineInputMode=inline
    export function วิ่งตามเส้น(speed: number, time: number, kp: number, kd: number): void {
        let previousMillis = input.runningTime()
        while (input.runningTime() - previousMillis < time) {
            track_line(speed, kp, kd)
        }
    }

    /**วิ่งตามเส้นเมื่อเจอเส้นตัด 
      * @param speed percent of maximum speed, eg: 800
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=LineRobot_วิ่งตามเส้นเมื่อเจอเส้นตัด block="วิ่งตามเส้นเมื่อเจอเส้นตัด %LineRobotCrossDirec | ด้วยความเร็ว %speed|KP %kp|KD %kd"
    //% speed.min=0 speed.max=800
    //% inlineInputMode=inline
    export function วิ่งตามเส้นเมื่อเจอเส้นตัด(crossType: LineRobotCrossDirec, speed: number, kp: number, kd: number): void {
        if (crossType == LineRobotCrossDirec.CrossWay) {
            crossWay(speed, kp, kd)
        }
        if (crossType == LineRobotCrossDirec.CrossThree) {
            crossWayT(speed, kp, kd)
        }
        if (crossType == LineRobotCrossDirec.CrossLeft) {
            crossLeft(speed, kp, kd)
        }
        if (crossType == LineRobotCrossDirec.CrossRight) {
            crossRight(speed, kp, kd)
        }
    }

    /**วิ่งตามเส้นเมื่อเจอเส้นตัด 
      * @param speed percent of maximum speed, eg: 800
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=LineRobot_crossWay block="crossWay ด้วยความเร็ว %speed|KP %kp|KD %kd"
    //% speed.min=0 speed.max=800
    //% inlineInputMode=inline
    function crossWay(speed: number, kp: number, kd: number): void {
        while (getCrossroad() == 0) {
            track_line(speed, kp, kd)
        }
    }

    function crossWayT(speed: number, kp: number, kd: number): void {
        while (getCrossroadT() == 0) {
            track_line(speed, kp, kd)
        }
    }

    /**วิ่งตามเส้นเมื่อเจอเส้นตัดทางซ้าย 
      * @param speed percent of maximum speed, eg: 800
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=LineRobot_วิ่งผ่านเส้นตัดทางซ้าย block="วิ่งผ่านเส้นตัดทางซ้าย ด้วยความเร็ว %speed|KP %kp|KD %kd"
    //% speed.min=0 speed.max=800
    //% inlineInputMode=inline
    function crossLeft(speed: number, kp: number, kd: number): void {
        while (getThreeCrossLeft() == 0) {
            track_line(speed, kp, kd)
        }
    }

    /**วิ่งตามเส้นเมื่อเจอเส้นตัดทางขวา 
      * @param speed percent of maximum speed, eg: 800
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=LineRobot_crossRight block="crossRight ด้วยความเร็ว %speed|KP %kp|KD %kd"
    //% speed.min=0 speed.max=800
    //% inlineInputMode=inline
    function crossRight(speed: number, kp: number, kd: number): void {
        while (getThreeCrossRight() == 0) {
            track_line(speed, kp, kd)
        }
    }

    function getCrossroad(): number {
        //if (pins.analogReadPin(AnalogPin.P0) > ValCrossRight && pins.analogReadPin(AnalogPin.P1) > ValCrossLeft) {
        if (pins.analogReadPin(AnalogPin.P0) > ValCrossRight && pins.analogReadPin(AnalogPin.P1) > ValCrossLeft && ReadADC(Sensors[3]) > ValCrossCenter) {
            state = true
        } else {
            state = false
            last_state = false
        }
        if (last_state != state) {
            last_state = state
            return 1
        }
        else {
            return 0
        }
    }

    function getCrossroadT(): number {

        if (pins.analogReadPin(AnalogPin.P0) > ValCrossRight && pins.analogReadPin(AnalogPin.P1) > ValCrossLeft && ReadADC(Sensors[3]) < ValCrossCenter) {
            state = true
        } else {
            state = false
            last_state = false
        }
        if (last_state != state) {
            last_state = state
            return 1
        }
        else {
            return 0
        }
    }

    /** เช็คทางสี่แยก,สามแยกขวาง 
                  */
    //% blockId="LineRobot_getCrossroad" block="getCrossroad"
    //% weight=50
    function getCrossroadOld(): number {
        let an0 = pins.analogReadPin(AnalogPin.P0)
        let an1 = pins.analogReadPin(AnalogPin.P1)
        if (an0 < 200 && an1 < 200) {
            state = true
        } else {
            state = false
            last_state = false
        }
        if (last_state != state) {
            last_state = state
            return 1
        }
        else {
            return 0
        }
    }

    /** เช็คทางสามแยก,สามแยกซ้ายหรือขวา 
                  */
    //% blockId="LineRobot_getThreeCrossLeft" block="getThreeCrossLeft"
    //% weight=50
    function getThreeCrossLeft(): number {
        //return pins.analogReadPin(AnalogPin.P1)
        if (pins.analogReadPin(AnalogPin.P1) > ValCrossLeft && ReadADC(Sensors[3]) > ValCrossCenter) {
            state_left = true
        } else {
            state_left = false
            last_state_left = false
        }
        if (last_state_left != state_left) {
            last_state_left = state_left
            return 1
        }
        else {
            return 0
        }
    }

    /** เช็คทางสามแยก,สามแยกซ้ายหรือขวา 
                  */
    //% blockId="LineRobot_getThreeCrossRight" block="getThreeCrossRight"
    //% weight=50
    function getThreeCrossRight(): number {
        if (pins.analogReadPin(AnalogPin.P0) > ValCrossRight && ReadADC(Sensors[3]) > ValCrossCenter) {
            state_right = true
        } else {
            state_right = false
            last_state_right = false
        }
        if (last_state_right != state_right) {
            last_state_right = state_right
            return 1
        }
        else {
            return 0
        }
    }


    /**เลี้ยว
      * @param speed percent of maximum speed, eg: 800
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=LineRobot_เลี้ยว block="เลี้ยว %LineRobotTurnDirec| ด้วยความเร็ว %speed"
    //% speed.min=0 speed.max=800
    //% inlineInputMode=inline
    export function เลี้ยว(direc: LineRobotTurnDirec, speed: number): void {
        if (direc == LineRobotTurnDirec.Left) {
            //while (readLine() > 0) {
            //    set_motors(speed, -speed)
            while(ReadADC(Sensors[0]) < midSSL0){
                set_motors(speed, -speed)
            }
            while (ReadADC(Sensors[3]) < midSSC){
                set_motors(speed, -speed)
            }


            while (readLine() == 0) {
                set_motors(speed, -speed)
            }
            while (readLine() < (numSensors - 1) * 1000 / 2) {
                set_motors(speed, -speed)
            }
        }
        if (direc == LineRobotTurnDirec.Right) {
            while (readLine() > 0) {
                set_motors(-speed, speed)
            }
            while (readLine() == 0) {
                set_motors(-speed, speed)
            }
            while (readLine() > (numSensors - 1) * 1000 / 2) {
                set_motors(-speed, speed)
            }
        }
    }


    /**เลี้ยวซ้าย
      * @param speed percent of maximum speed, eg: 800
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=LineRobot_เลี้ยวซ้าย block="เลี้ยวซ้าย ด้วยความเร็ว %speed"
    //% speed.min=0 speed.max=800
    //% inlineInputMode=inline
    function เลี้ยวซ้าย(speed: number): void {
        while (readLine() > 0) {
            set_motors(speed, -speed)
        }
        while (readLine() == 0) {
            set_motors(speed, -speed)
        }
        while (readLine() < (numSensors - 1) * 1000 / 2) {
            set_motors(speed, -speed)
        }
    }

    /**เลี้ยวขวา
      * @param speed percent of maximum speed, eg: 800
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=LineRobot_เลี้ยวขวา block="เลี้ยวขวา ด้วยความเร็ว %speed"
    //% speed.min=0 speed.max=800
    //% inlineInputMode=inline
    function เลี้ยวขวา(speed: number): void {
        while (readLine() > 0) {
            set_motors(-speed, speed)
        }
        while (readLine() == 0) {
            set_motors(-speed, speed)
        }
        while (readLine() > (numSensors - 1) * 1000 / 2) {
            set_motors(-speed, speed)
        }
    }

    /** รอการกดปุ่ม  
              */
    //% blockId="LineRobot_รอการกดปุ่ม" block="รอการกดปุ่ม | %button"
    //% weight=75
    export function รอการกดปุ่ม(button: LineRobotButton): void {
        if (button == LineRobotButton.A) {
            while (!(input.buttonIsPressed(Button.A))) {
                basic.showArrow(ArrowNames.West)
            }
        }
        if (button == LineRobotButton.B) {
            while (!(input.buttonIsPressed(Button.B))) {
                basic.showArrow(ArrowNames.East)
            }
        }
    }

    /** หยุดมอเตอร์ มอเตอร์1,มอเตอร์2   
          */
    //% blockId="LineRobot_หยุดมอเตอร์" block="หยุดมอเตอร์"
    //% weight=50
    export function หยุดมอเตอร์(): void {
        while (true) {
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.analogWritePin(AnalogPin.P14, 0)
            pins.digitalWritePin(DigitalPin.P15, 1)
            pins.analogWritePin(AnalogPin.P16, 0)
        }
    }

    function track_line(track_speed: number, track_kp: number, track_kd: number) {
        let power_difference = 0
        let positionValue = readLine()
        if (positionValue != 0) {
            last_positionValue = positionValue
        }
        if (positionValue == 0 && last_positionValue < (numSensors - 1) * 1000 / 2) {
            set_motors(speedTurn, 0)
            return
        }
        if (positionValue == 0 && last_positionValue > (numSensors - 1) * 1000 / 2) {
            set_motors(0, speedTurn)
            return
        }
        power_difference = computePID(positionValue, track_kp, track_kd)
        if (power_difference > track_speed) {
            power_difference = track_speed
        }
        if (power_difference < 0 - track_speed) {
            power_difference = 0 - track_speed
        }
        if (power_difference < 0) {
            set_motors(track_speed, track_speed + power_difference)
        } else {
            set_motors(track_speed - power_difference, track_speed)
        }
    }

    //% blockId="LineRobot_readLine" block="readLine"
    //% weight=80
    export function readLine(): number {
        let on_line = 0
        let last_value = 0
        let avg = 0
        let sum = 0
        readCalibrated()
        avg = 0
        sum = 0
        for (let k = 0; k < numSensors; k++) {
            let valReadLine = sensorsRead[k]
            if (valReadLine > 200) {
                on_line = 1
            }
            if (valReadLine > 50) {
                avg = avg + valReadLine * (k * 1000)
                sum = sum + valReadLine
            }
        }

        if (on_line == 0) {
            if (last_value < (numSensors - 1) * 1000 / 2) {
                return 0
            } else {
                return (numSensors - 1) * 1000
            }
        }
        last_value = avg / sum
        return last_value
    }

    //% blockId="LineRobot_computePID" block="computePID | line %line  | kp %kp | kd %kd"
    //% weight=100
    function computePID(line: number, kp: number, kd: number): number {
        let power_diff = 0
        error = line - (numSensors - 1) * 1000 / 2
        power_diff = kp * error + kd * (error - lastError)

        lastError = error
        return power_diff
    }

    /** ความเร็วมอเตอร์ มอเตอร์1,มอเตอร์2   
      * @param left_speed percent of maximum left_speed, eg: 0
      * @param right_speed percent of maximum right_speed, eg: 0
      */
    //% blockId="LineRobot_set_motors" block="set_motors | left_speed %left_speed | right_speed %right_speed"
    //% Speed.min=0 Speed.max=800
    //% weight=50
    export function set_motors(left_speed: number, right_speed: number): void {
        //left_speed = Math.map(left_speed, 0, 1000, 0, 620)
        //right_speed = Math.map(right_speed, 0, 1000, 0, 620)
        //Forward
        if (right_speed >= 0 && left_speed >= 0) {
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.analogWritePin(AnalogPin.P14, left_speed)
            pins.digitalWritePin(DigitalPin.P15, 0)
            pins.analogWritePin(AnalogPin.P16, right_speed)
        }
        if (right_speed >= 0 && left_speed < 0) {
            left_speed = -left_speed
            pins.digitalWritePin(DigitalPin.P13, 0)
            pins.analogWritePin(AnalogPin.P14, left_speed)
            pins.digitalWritePin(DigitalPin.P15, 0)
            pins.analogWritePin(AnalogPin.P16, right_speed)
        }
        if (right_speed < 0 && left_speed >= 0) {
            right_speed = -right_speed
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.analogWritePin(AnalogPin.P14, left_speed)
            pins.digitalWritePin(DigitalPin.P15, 1)
            pins.analogWritePin(AnalogPin.P16, right_speed)
        }
    }

    /**
     * Control ServoKeeper
     * @param Degree servo degree 0-180, eg: 90
     */
    //% blockId="LineRobot_ServoKeeper" block="มือจับ %LineRobotServo"
    //% Degree.min=0 Degree.max=180
    //% weight=75
    export function ServoKeeper(Servo: LineRobotServoKeeper): void {
        if (Servo == LineRobotServoKeeper.Up) {
            pins.servoWritePin(AnalogPin.P8, 160)
        }
        if (Servo == LineRobotServoKeeper.Down) {
            pins.servoWritePin(AnalogPin.P8, 50)
        }
        if (Servo == LineRobotServoKeeper.Keep) {
            pins.servoWritePin(AnalogPin.P12, 100)
        }
        if (Servo == LineRobotServoKeeper.Leave) {
            pins.servoWritePin(AnalogPin.P12, 0)
        }
    }

    /**
     * Control Servo 1 or 2 set degree between 0 - 180
     * @param Degree servo degree 0-180, eg: 90
     */
    //% blockId="LineRobot_Servo" block="Servo %LineRobotServo|Degree %Degree"
    //% Degree.min=0 Degree.max=180
    //% weight=75
    function Servo(Servo: LineRobotServo, Degree: number): void {
        if (Servo == LineRobotServo.SV1) {
            pins.servoWritePin(AnalogPin.P8, Degree)
        }
        if (Servo == LineRobotServo.SV2) {
            pins.servoWritePin(AnalogPin.P12, Degree)
        }
    }

    /**
    * Control Servo 1 or 2 set to freedom
    */
    //% blockId="LineRobot_ServoStop" block="Servo Stop %LineRobotServo"
    //% weight=70
    function ServoStop(Servo: LineRobotServo): void {
        if (Servo == LineRobotServo.SV1) {
            pins.servoSetPulse(AnalogPin.P8, 0)
        }
        if (Servo == LineRobotServo.SV2) {
            pins.servoSetPulse(AnalogPin.P12, 0)
        }
    }

    /**ReadADC for read analog sensor, Select ADC channel 0-7. 
      *
      */
    //% blockId="LineRobot_readADC" block="Read %LineRobotReadADC"
    //% weight=60
    function ReadADC(ReadADC: LineRobotReadADC): number {
        let ADCValue: number;

        pins.i2cWriteNumber(
            72,
            ReadADC,
            NumberFormat.UInt8LE,
            false
        )
        return ReadADC = pins.i2cReadNumber(72, NumberFormat.UInt16BE, false)
    }

    function readSensors() {
        for (let z = 0; z < numSensors; z++) {
            sensorsRead[z] = ReadADC(Sensors[z])
        }
    }

    function readCrossSensors() {
        //pins.analogReadPin(AnalogPin.P0)
        //for (let z = 0; z < 2; z++) {
        sensorsCrossRead[0] = pins.analogReadPin(AnalogPin.P0)
        sensorsCrossRead[1] = pins.analogReadPin(AnalogPin.P1)
        //}
    }

    //% blockId="LineRobot_caribrateSensors" block="caribrateSensors"
    //% weight=90
    function caribrateCrossSensors(): void {
        readCrossSensors()
        for (let x = 0; x < 2; x++) {
            if (sensorsCrossRead[x] < valSensorsCrossMin[x]) {
                valSensorsCrossMin[x] = sensorsCrossRead[x]
            }
            if (sensorsCrossRead[x] > valSensorsCrossMax[x]) {
                valSensorsCrossMax[x] = sensorsCrossRead[x]
            }
        }
    }

    //% blockId="LineRobot_caribrateSensors" block="caribrateSensors"
    //% weight=90
    function caribrateSensors(): void {
        readSensors()
        for (let x = 0; x < numSensors; x++) {
            if (sensorsRead[x] < valSensorsMin[x]) {
                valSensorsMin[x] = sensorsRead[x]
            }
            if (sensorsRead[x] > valSensorsMax[x]) {
                valSensorsMax[x] = sensorsRead[x]
            }
        }
    }

    function readCalibrated() {
        readSensors()
        for (let y = 0; y < numSensors; y++) {
            let calmin = 0
            let calmax = 0
            let denominator = 0
            calmax = valSensorsMax[y]
            calmin = valSensorsMin[y]
            denominator = calmax - calmin
            let calVal = 0
            if (denominator != 0) {
                calVal = (sensorsRead[y] - calmin) * 1000 / denominator
            }
            if (calVal < 0) {
                calVal = 0
            } else if (calVal > 1000) {
                calVal = 1000
            }
            //sensorsRead[y] = calVal
            //เป็นเส้นสีขาว
            if (lineClr_isWhite) {
                sensorsRead[y] = 1000 - calVal;
            }
            else {
                sensorsRead[y] = calVal;
            }
        }
    }
}

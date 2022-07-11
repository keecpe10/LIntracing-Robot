LineRobot.ตั้งค่า(LineRobotLineColor.white, 2, 600)
LineRobot.รอการกดปุ่ม(LineRobotButton.A)
basic.showIcon(IconNames.SmallHeart)
LineRobot.เปรียบเทียบค่าเซ็นเซอร์()
LineRobot.รอการกดปุ่ม(LineRobotButton.B)
basic.showIcon(IconNames.Heart)
basic.forever(function () {
    LineRobot.วิ่งตามเส้นตลอด(700, 0.06, 18)
})

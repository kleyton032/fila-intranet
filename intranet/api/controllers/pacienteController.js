const paciente  = require("../models/Paciente.js")

const get = async (req, res, next) => {
    try {
      const params = req.query;
      
      console.log(params)
  
      const rows = await paciente.getPaciente(params);
  
      if (rows.length > 0) {

            const serialDeviceOnWindows = new escpos.Serial('COM3');
            const printer = new escpos.Printer(serialDeviceOnWindows);

            serialDeviceOnWindows.open((err) => {
                printer
                .font('A')
                .align('CT')
                .size(1, 1)
                .text('敏捷的棕色狐狸跳过懒狗') // default encoding set is GB18030
                .encode('EUC-KR') // set encode globally
                .text('동해물과 백두산이 마르고 닳도록')
                .text('こんにちは', 'EUC-JP') // set encode functional
                .cut()
                .close();
              });

        res.status(200).json(rows);
      } else {
        res.status(204).end();
      }
    } catch (error) {
      console.log(error)
      next(error);
    }
};

module.exports = { get}

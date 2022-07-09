const router = require("express").Router();
const Message = require("../models/message.model");

router.post("/", async (req, res) => {
  const message = new Message(req.body);

  try {
    const saveMsg = await message.save();
    res.status(200).json(saveMsg);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/:conID", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conID,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

const router = require("express").Router();
const Ticket = require("../models/Ticket");
const auth = require("../middleware/auth");

// CREATE TICKET
router.post("/", auth, async (req, res) => {

  const ticket = new Ticket({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    userId: req.user.id
  });

  await ticket.save();

  res.json(ticket);
});


// GET MY TICKETS
router.get("/", auth, async (req, res) => {

  const tickets = await Ticket.find({
    userId: req.user.id
  });

  res.json(tickets);
});


// UPDATE TICKET
router.put("/:id", auth, async (req, res) => {

  const updated = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
});


// DELETE TICKET
router.delete("/:id", auth, async (req, res) => {

  await Ticket.findByIdAndDelete(req.params.id);

  res.json({ msg: "Deleted" });
});

module.exports = router;
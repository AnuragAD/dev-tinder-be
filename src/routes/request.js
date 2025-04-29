const express = require("express");
const { authorizeUser } = require("../middlewares/authorize");
const connectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  authorizeUser,
  async (req, res) => {
    try {
      const allowedStatus = ["intrested", "ignored"];
      const status = req?.params?.status;
      if (!allowedStatus.includes(status)) {
        throw new Error("Incorrect Status type");
      }
      const toUserId = req.params.toUserId;
      const fromUserId = req?.user?._id;
      if (toUserId == fromUserId) {
        throw new Error("You cannot send connection request to yourself");
      }
      const isToUserIdValid = await User.findById({ _id: toUserId });
      if (!isToUserIdValid) {
        throw new Error("To user id is Invalid");
      }

      const isConnectionExists = await isConnectionRequestExists(
        fromUserId,
        toUserId
      );
      if (isConnectionExists) {
        throw new Error("Connection request already present");
      }
      const ConnectionRequest = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await ConnectionRequest.save();
      res.json({
        message: "connection request sent",
        data,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  authorizeUser,
  async (req, res) => {
    try {
      const { requestId, status } = req?.params;

      // check request Id valid
      const isRequestIdValid = await checkRequestId(requestId);
      if (!isRequestIdValid) {
        throw new Error("Invalid Request Id");
      }

      //check Status is valid
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status");
      }

      const data = await connectionRequest.findById({
        _id: requestId,
        status: "intrested",
        toUserId: req?.user._id,
      });
      if (!data) {
        throw new Error("Request cannot be accepted");
      }

      // Start Saving
      data.status = status;
      await data.save();
      res.json({
        message: "Connection request Accepted",
        data,
      });
    } catch (error) {
      res.status(400).json({ message: error?.message });
    }
  }
);

const isConnectionRequestExists = async (fromUserId, toUserId) => {
  return await connectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { toUserId: fromUserId, fromUserId: toUserId },
    ],
  });
};

const checkRequestId = async (requestId) => {
  return await connectionRequest.findById(requestId);
};

module.exports = requestRouter;

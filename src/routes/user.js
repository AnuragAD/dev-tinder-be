const express = require("express");
const userRouter = express.Router();
const { authorizeUser } = require("../middlewares/authorize");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");

const USER_COLLECTION_FIELDS =
  "firstName lastName, age, gender, photoUrl, skills";

userRouter.get("/feed", authorizeUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { skip, limit } = getFilters(req?.query);

    //USer should see all the user except
    // 1. His own
    //2.  His Connections
    // 3. Users he ignored/blocked
    // 4. Users that ignored/blocked current user
    // 5 Users he already sent connection request.
    // 6. Users who sent connection request to current user.
    const connectionRequestsSentRecieved = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
    });

    const removedUserFromFeed = new Set();

    connectionRequestsSentRecieved.forEach((conreq) => {
      removedUserFromFeed.add(conreq.toUserId.toString());
      removedUserFromFeed.add(conreq.fromUserId.toString());
    });

    const usersFeed = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(removedUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_COLLECTION_FIELDS)
      .skip(skip)
      .limit(limit);
    res.json(usersFeed);
  } catch (error) {
    res.status(401).send("Something Went Wrong");
  }
});

userRouter.get("/conections", authorizeUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userConnections = await ConnectionRequestModel.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("toUserId", USER_COLLECTION_FIELDS)
      .populate("fromUserId", USER_COLLECTION_FIELDS);

    const connectionData = userConnections.map((data) => {
      if (loggedInUser._id.toString() === data.fromUserId.toString()) {
        return data.toUserId;
      } else return data.fromUserId;
    });
    res.json({
      data: connectionData,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/user/requests", authorizeUser, async (req, res) => {
  try {
    const loggedInUser = req?.user;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser?._id,
      status: "intrested",
    }).populate("fromUserId", USER_COLLECTION_FIELDS);
    res.json({ data: connectionRequest });
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
});

function getFilters(query) {
  let skip = 0;
  let limit = 10;
  if (query?.skip && query?.limit) {
    return { skip: query.skip, limit: +query.limit < 50 ? query.limit : 50 };
  } else if (query?.skip && !query?.limit) {
    return { skip: query.skip, limit };
  } else if (!query?.skip && query?.limit) {
    return { skip, limit: query.limit };
  } else return { skip, limit };
}

module.exports = userRouter;

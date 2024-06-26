import helpers from '../helpers.js';
import {ObjectId} from 'mongodb';
import {users} from '../config/mongoCollections.js';
import bcrypt from 'bcrypt';
import validation from '../validation.js';

export const getUserById = async (userId) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};


export const registerUser = async (
  userName,
  email,
  dateOfBirth,
  bio,
  password,
) => {

  helpers.checkIfValid(userName, email, dateOfBirth, bio, password)
  userName = helpers.checkuserName(userName);
  email = helpers.checkEmail(email);
  dateOfBirth = helpers.checkDateOfBirth(dateOfBirth);
  bio = helpers.checkbio(bio);
  password = helpers.checkPassword(password);

  const userCollection = await users(); 
  const checkEmailExisted = await userCollection.findOne({ email: email });
  if (checkEmailExisted) throw 'Error: A user with this email already exists!';
  const checkUserExisted = await userCollection.findOne({ userName: userName });
  if (checkUserExisted) throw 'Error: A user with this userName already exists!';

  const newUser = {
    userName,
    email,
    dateOfBirth,
    bio,
    password: await bcrypt.hash(password, 10), 
    personalParkPassport: [],
    favorite: [],
    reviews: [],
    likedReviews: [],
    comments: []
  };

  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Could not add this user';

  return { insertedUser: true, userId: insertInfo.insertedId };
};


export const loginUser = async (usernameOrEmail, password) => {

  usernameOrEmail = helpers.checkuserNameorEmail(usernameOrEmail);
  password = helpers.checkPassword(password);
  

  usernameOrEmail = usernameOrEmail.trim().toLowerCase();
  password = password.trim();

 
  const userCollection = await users();


  const userInfo = await userCollection.findOne({
    $or: [
      { userName: usernameOrEmail },
      { email: usernameOrEmail }
    ]
  });

  if (!userInfo) throw 'The username or email did not exist!';

  const comparePassword = await bcrypt.compare(password, userInfo.password);
  if (!comparePassword) throw 'The password is incorrect!';

  return {
    userId: userInfo._id,
    userName: userInfo.userName,
    email: userInfo.email,
    dateOfBirth: userInfo.dateOfBirth,
    bio: userInfo.bio,
    personalParkPassport: userInfo.personalParkPassport,
    favorite: userInfo.favorite,
    reviews: userInfo.reviews,
    likedReviews: userInfo.likedReviews,
    comments: userInfo.comments
  };
};

export const addToLiked = async (userId, reviewId) => {
  userId = validation.checkId(userId);
  
  const userCollection = await users();

  const updateInfo = await userCollection.updateOne(
    { _id: new ObjectId(userId) }, 
    { $push: { likedReviews: {reviewId}} } 
  );

  if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
    throw 'Update failed: No user found or Liked reviews not modified.';
  }

  return updateInfo.modifiedCount > 0;
};

export const deleteLiked = async (userId, reviewId) => {
  userId = validation.checkId(userId);
  const userCollection = await users();
 
  const updateInfo = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { likedReviews: {reviewId} } } 
  );
  
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw 'Update failed: No user found or Liked reviews not modified.';

  return updateInfo.modifiedCount > 0;
};

export const addToFavorites = async (userId, park) => {
  userId = validation.checkId(userId);
  const userCollection = await users();

  const updateInfo = await userCollection.updateOne(
    { _id: new ObjectId(userId) }, 
    { $push: { favorite: park } } 
  );

  if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
    throw 'Update failed: No user found or favorite not modified.';
  }

  return updateInfo.modifiedCount > 0;
};

export const deleteFavorite = async (userId, parkId) => {
  userId = validation.checkId(userId);
  const userCollection = await users();
 
  const updateInfo = await userCollection.updateOne(
    { _id: new ObjectId(userId) }, 
    { $pull: { favorite: { parkId } } } 
  );
  
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw 'Update failed: No user found or favorite not modified.';

  return updateInfo.modifiedCount > 0;
};

export const addToPassport = async (userId, park) => {
  userId = validation.checkId(userId);
  const userCollection = await users();
  const updateInfo = await userCollection.updateOne(
    { _id: new ObjectId(userId) }, 
    { $push: { personalParkPassport: park } } 
  );

  if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
    throw 'Update failed: No user found or passport not modified.';
  }

  return updateInfo.modifiedCount > 0;
};

export const addToReviews = async (userId, review) => {
  userId = validation.checkId(userId);
  const userCollection = await users();

  const updateInfo = await userCollection.updateOne(
    { _id: new ObjectId(userId) }, 
    { $push: { reviews: review} } 
  );

  if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
    throw 'Update failed: No user found or review not modified.';
  }

  return updateInfo.modifiedCount > 0;
};

export const deleteParkFromPassport = async (userId, parkId) => {
  userId = validation.checkId(userId);
  const userCollection = await users();


  const updateInfo = await userCollection.updateOne(
    { _id: new ObjectId(userId) }, 
    { $pull: { personalParkPassport: { parkId } } } 
  );

  if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
    throw 'Update failed: No user found or passport park not modified.';
  }

  return updateInfo.modifiedCount > 0;
};

export const deleteReviews = async (userId, reviewId) => {
  userId = validation.checkId(userId);
  const userCollection = await users();

  const updateInfo = await userCollection.updateOne(
    { _id: new ObjectId(userId) }, 
    { $pull: { reviews: { reviewId } } } 
  );

  if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
    throw 'Update failed: No user found or review not modified.';
  }

  return updateInfo.modifiedCount > 0;
};

export const addToComments = async (userId, comment) => {
  userId = validation.checkId(userId);
  const userCollection = await users();

  const updateInfo = await userCollection.updateOne(
    { _id: new ObjectId(userId) }, 
    { $push: { comments: comment } } 
  );

  if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
    throw 'Update failed: No user found or favorite not modified.';
  }

  return updateInfo.modifiedCount > 0;
};

export const deleteComments = async (userId, commentId) => {
  userId = validation.checkId(userId);
  const userCollection = await users();

  const updateInfo = await userCollection.updateOne(
    { _id: new ObjectId(userId) }, 
    { $pull: { comments: { commentId } } } 
  );

  if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
    throw 'Update failed: No user found or review not modified.';
  }

  return updateInfo.modifiedCount > 0;
};